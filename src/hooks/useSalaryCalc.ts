import { useMemo } from 'react'

// ── Public types ─────────────────────────────────────────────

export type StudentPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'
export type Region      = 'england' | 'wales' | 'ni' | 'scotland'

export interface SalaryCalcInput {
  gross:           number
  pensionPct:      number
  region:          Region
  age:             number
  studentPlan:     StudentPlan
  blindAllowance:  boolean
  salarySacrifice: boolean
}

export interface SalaryCalcResult {
  takehome:          number
  incomeTax:         number
  nationalInsurance: number
  pension:           number
  studentLoan:       number
  effectiveRate:     number   // (incomeTax + NI) / gross × 100
  marginalRate:      number   // top income-tax band rate × 100 (e.g. 20, 40, 45)
}

// ── Tax constants ────────────────────────────────────────────

const PA_BASE     = 12_570
const BLIND_EXTRA =  3_070

const NI_PT    = 12_570   // primary threshold
const NI_UEL   = 50_270   // upper earnings limit
const NI_MAIN  = 0.08     // 8%  on PT–UEL
const NI_UPPER = 0.02     // 2%  above UEL

const STUDENT_THRESHOLDS: Record<Exclude<StudentPlan, 'none'>, number> = {
  plan1: 24_990,
  plan2: 27_295,
  plan4: 31_395,
  plan5: 25_000,
}

// ── Income-tax band definitions ──────────────────────────────
//
// Widths are expressed as taxable-income slices (i.e. after the
// personal allowance has already been subtracted).
//
// RUK  : £12,571–£50,270  → basic  width  37,700  @ 20%
//        £50,271–£125,140 → higher width  74,870  @ 40%
//        above            → add.   width ∞        @ 45%
//
// SCO  : £12,571–£15,397  → starter       2,827   @ 19%
//        £15,398–£27,491  → basic         12,094   @ 20%
//        £27,492–£43,662  → intermediate  16,171   @ 21%
//        £43,663–£75,000  → higher        31,338   @ 42%
//        £75,001–£125,140 → advanced      50,140   @ 45%
//        above            → top           ∞        @ 48%

type BandDef = { width: number; rate: number }

const RUK_BANDS: BandDef[] = [
  { width: 37_700,   rate: 0.20 },
  { width: 74_870,   rate: 0.40 },
  { width: Infinity, rate: 0.45 },
]

const SCO_BANDS: BandDef[] = [
  { width:  2_827,   rate: 0.19 },
  { width: 12_094,   rate: 0.20 },
  { width: 16_171,   rate: 0.21 },
  { width: 31_338,   rate: 0.42 },
  { width: 50_140,   rate: 0.45 },
  { width: Infinity, rate: 0.48 },
]

// ── Pure calculation ─────────────────────────────────────────

function applyBands(
  taxableIncome: number,
  bands: BandDef[],
): { tax: number; marginalRate: number } {
  let remaining    = taxableIncome
  let tax          = 0
  let marginalRate = 0

  for (const { width, rate } of bands) {
    if (remaining <= 0) break
    const inBand  = width === Infinity ? remaining : Math.min(remaining, width)
    tax          += inBand * rate
    marginalRate  = rate
    remaining    -= inBand
  }

  return { tax, marginalRate }
}

function calcAll(input: SalaryCalcInput): SalaryCalcResult {
  const { gross, pensionPct, region, age, studentPlan, blindAllowance, salarySacrifice } = input

  // Pension
  const pension = gross * (pensionPct / 100)

  // Salary sacrifice shifts the NI-able and taxable base down by the pension amount
  const taxBase = salarySacrifice ? Math.max(0, gross - pension) : gross

  // Personal allowance — taper at £1 removed per £2 over £100k
  const paFull = PA_BASE + (blindAllowance ? BLIND_EXTRA : 0)
  const pa     = gross > 100_000
    ? Math.max(0, paFull - Math.floor((gross - 100_000) / 2))
    : paFull

  // Income tax
  const taxableIncome           = Math.max(0, taxBase - pa)
  const bandDefs                = region === 'scotland' ? SCO_BANDS : RUK_BANDS
  const { tax: incomeTax, marginalRate } = applyBands(taxableIncome, bandDefs)

  // National Insurance — exempt at 65+
  let nationalInsurance = 0
  if (age < 65) {
    const niBase  = salarySacrifice ? Math.max(0, gross - pension) : gross
    const niMain  = niBase > NI_PT  ? Math.min(niBase - NI_PT, NI_UEL - NI_PT) * NI_MAIN  : 0
    const niUpper = niBase > NI_UEL ? (niBase - NI_UEL) * NI_UPPER : 0
    nationalInsurance = niMain + niUpper
  }

  // Student loan — 9% above plan threshold, applied on gross
  let studentLoan = 0
  if (studentPlan !== 'none') {
    const threshold = STUDENT_THRESHOLDS[studentPlan]
    if (gross > threshold) studentLoan = (gross - threshold) * 0.09
  }

  const takehome     = gross - pension - incomeTax - nationalInsurance - studentLoan
  const effectiveRate = gross > 0 ? ((incomeTax + nationalInsurance) / gross) * 100 : 0

  return {
    takehome,
    incomeTax,
    nationalInsurance,
    pension,
    studentLoan,
    effectiveRate,
    marginalRate: marginalRate * 100,
  }
}

// ── Hook ─────────────────────────────────────────────────────

export function useSalaryCalc(input: SalaryCalcInput): SalaryCalcResult {
  return useMemo(
    () => calcAll(input),
    // Spread primitives so the memo only re-runs when a value actually changes,
    // not on every render that produces a new input object reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      input.gross,
      input.pensionPct,
      input.region,
      input.age,
      input.studentPlan,
      input.blindAllowance,
      input.salarySacrifice,
    ],
  )
}
