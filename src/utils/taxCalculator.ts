// ── Types ────────────────────────────────────────────────────

export type TaxYear      = '2025/26' | '2026/27'
export type PayFrequency = 'monthly' | 'weekly' | 'quarterly' | 'annually'
export type StudentLoan  = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad'
export type Region       = 'england' | 'wales' | 'ni' | 'scotland'
export type ResultPeriod = 'annual' | 'monthly' | 'weekly' | 'daily'

// ── Constants ────────────────────────────────────────────────

export const BLIND_ALLOWANCE   = 3_070
export const STATE_PENSION_AGE = 66
export const PA_BASE           = 12_570

export const RESULT_PERIODS: { value: ResultPeriod; label: string }[] = [
  { value: 'annual',  label: 'Annual'  },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'daily',   label: 'Daily'   },
]

export const RESULT_DIVISORS: Record<ResultPeriod, number> = {
  annual: 1, monthly: 12, weekly: 52, daily: 260,
}

export const INPUT_FREQ_DIVISORS: Record<PayFrequency, number> = {
  monthly: 12, weekly: 52, quarterly: 4, annually: 1,
}

// ── Tax band definitions ─────────────────────────────────────

export type TaxBandDef = { limit: number; rate: number; label: string; color: string }

export const RUK_BANDS: TaxBandDef[] = [
  { limit: 37_700,   rate: 0.20, label: 'Basic rate (20%)',      color: '#1EC8FF' },
  { limit: 112_570,  rate: 0.40, label: 'Higher rate (40%)',     color: '#FFB547' },
  { limit: Infinity, rate: 0.45, label: 'Additional rate (45%)', color: '#FF4E7A' },
]

export const SCO_BANDS: TaxBandDef[] = [
  { limit: 2_827,    rate: 0.19, label: 'Starter rate (19%)',      color: '#93C5FD' },
  { limit: 14_921,   rate: 0.20, label: 'Basic rate (20%)',        color: '#1EC8FF' },
  { limit: 31_092,   rate: 0.21, label: 'Intermediate rate (21%)', color: '#6EE7B7' },
  { limit: 62_430,   rate: 0.42, label: 'Higher rate (42%)',       color: '#FFB547' },
  { limit: 112_570,  rate: 0.45, label: 'Advanced rate (45%)',     color: '#FF8A4C' },
  { limit: Infinity, rate: 0.48, label: 'Top rate (48%)',          color: '#FF4E7A' },
]

export const NI_CONFIG = {
  '2025/26': { pt: 12_570, uel: 50_270, main: 0.08, upper: 0.02 },
  '2026/27': { pt: 12_570, uel: 50_270, main: 0.08, upper: 0.02 },
} as const

export const STUDENT_LOAN_TABLE: Record<StudentLoan, { threshold: number; rate: number } | null> = {
  none:     null,
  plan1:    { threshold: 24_990, rate: 0.09 },
  plan2:    { threshold: 27_295, rate: 0.09 },
  plan4:    { threshold: 31_395, rate: 0.09 },
  plan5:    { threshold: 25_000, rate: 0.09 },
  postgrad: { threshold: 21_000, rate: 0.06 },
}

// Full band lists for the visual breakdown (include zero-income bands so all rows always render)
export const FULL_RUK_BANDS: { label: string; rate: number; color: string }[] = [
  { label: 'Personal allowance',    rate: 0,    color: 'rgba(255,255,255,0.25)' },
  { label: 'Basic rate (20%)',      rate: 0.20, color: '#1EC8FF'               },
  { label: 'Higher rate (40%)',     rate: 0.40, color: '#FFB547'               },
  { label: 'Additional rate (45%)', rate: 0.45, color: '#FF4E7A'               },
]

export const FULL_SCO_BANDS: { label: string; rate: number; color: string }[] = [
  { label: 'Personal allowance',      rate: 0,    color: 'rgba(255,255,255,0.25)' },
  { label: 'Starter rate (19%)',      rate: 0.19, color: '#93C5FD'               },
  { label: 'Basic rate (20%)',        rate: 0.20, color: '#1EC8FF'               },
  { label: 'Intermediate rate (21%)', rate: 0.21, color: '#6EE7B7'               },
  { label: 'Higher rate (42%)',       rate: 0.42, color: '#FFB547'               },
  { label: 'Advanced rate (45%)',     rate: 0.45, color: '#FF8A4C'               },
  { label: 'Top rate (48%)',          rate: 0.48, color: '#FF4E7A'               },
]

// ── Calculation engine ───────────────────────────────────────

export type Band = { label: string; taxable: number; rate: number; tax: number; color: string }
export type CalcResult = {
  gross: number; pension: number; incomeTax: number
  ni: number; studentLoan: number; net: number; bands: Band[]
}

export function computeBands(
  taxableIncome: number,
  defs: TaxBandDef[],
  pa: number,
  afterPension: number,
): Band[] {
  const out: Band[] = [{
    label: 'Personal allowance',
    taxable: Math.min(afterPension, pa),
    rate: 0, tax: 0, color: 'rgba(255,255,255,0.06)',
  }]
  let remaining = taxableIncome
  let prev = 0
  for (const d of defs) {
    if (remaining <= 0) break
    const width  = d.limit === Infinity ? remaining : d.limit - prev
    const inBand = Math.min(remaining, width)
    if (inBand > 0) {
      out.push({ label: d.label, taxable: inBand, rate: d.rate, tax: inBand * d.rate, color: d.color })
      remaining -= inBand
    }
    if (d.limit !== Infinity) prev = d.limit
  }
  return out.filter(b => b.taxable > 0)
}

export function calculate(
  gross: number,
  pensionPct: number,
  salarySacrifice: boolean,
  loan: StudentLoan,
  taxYear: TaxYear,
  region: Region,
  blind: boolean,
  age: number,
): CalcResult {
  const ni         = NI_CONFIG[taxYear]
  const bandDefs   = region === 'scotland' ? SCO_BANDS : RUK_BANDS
  const pension    = gross * (pensionPct / 100)
  const afterPension = Math.max(0, gross - pension)

  const basePa = PA_BASE + (blind ? BLIND_ALLOWANCE : 0)
  const pa     = gross > 100_000
    ? Math.max(0, basePa - Math.floor((gross - 100_000) / 2))
    : basePa

  const taxableIncome = Math.max(0, afterPension - pa)
  const bands         = computeBands(taxableIncome, bandDefs, pa, afterPension)
  const incomeTax     = bands.reduce((s, b) => s + b.tax, 0)

  const niableGross = salarySacrifice ? Math.max(0, gross - pension) : gross
  const niExempt    = age > 0 && age >= STATE_PENSION_AGE
  let niAmount = 0
  if (!niExempt) {
    const niMain  = niableGross > ni.pt  ? Math.min(niableGross - ni.pt, ni.uel - ni.pt) * ni.main  : 0
    const niUpper = niableGross > ni.uel ? (niableGross - ni.uel) * ni.upper : 0
    niAmount = niMain + niUpper
  }

  const slCfg       = STUDENT_LOAN_TABLE[loan]
  const studentLoan = slCfg && gross > slCfg.threshold
    ? (gross - slCfg.threshold) * slCfg.rate
    : 0

  const net = gross - pension - incomeTax - niAmount - studentLoan
  return { gross, pension, incomeTax, ni: niAmount, studentLoan, net, bands }
}

// ── Formatting helper ────────────────────────────────────────

export const fmtGBP = (n: number, dp = 0) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP',
    minimumFractionDigits: dp, maximumFractionDigits: dp,
  }).format(n)

// ── Option arrays ────────────────────────────────────────────

export const TAX_YEAR_OPTIONS: { value: TaxYear; label: string }[] = [
  { value: '2025/26', label: '2025 / 26' },
  { value: '2026/27', label: '2026 / 27' },
]

export const FREQ_OPTIONS: { value: PayFrequency; label: string }[] = [
  { value: 'monthly',   label: 'Monthly'   },
  { value: 'weekly',    label: 'Weekly'    },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually',  label: 'Annually'  },
]

export const LOAN_OPTIONS: { value: StudentLoan; label: string }[] = [
  { value: 'none',     label: 'None'         },
  { value: 'plan1',    label: 'Plan 1'        },
  { value: 'plan2',    label: 'Plan 2'        },
  { value: 'plan4',    label: 'Plan 4'        },
  { value: 'plan5',    label: 'Plan 5'        },
  { value: 'postgrad', label: 'Postgraduate'  },
]

export const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: 'england',  label: 'England'          },
  { value: 'wales',    label: 'Wales'             },
  { value: 'ni',       label: 'Northern Ireland'  },
  { value: 'scotland', label: 'Scotland'          },
]
