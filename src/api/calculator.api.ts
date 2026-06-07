import { api } from './client'

export interface CalcSavePayload {
  inputs: {
    gross:           number
    pensionPct:      number
    region:          string
    age:             number
    studentLoan:     string
    blindAllowance:  boolean
    salarySacrifice: boolean
    taxCode:         string
    taxYear:         string
  }
  results: {
    takehome:      number
    incomeTax:     number
    ni:            number
    pension:       number
    effectiveRate: number
    marginalRate:  number
  }
}

export interface CalcSnapshot {
  id:      string
  savedAt: string   // ISO date string from the server
  gross:   number
  takehome: number
}

export const calculatorApi = {
  save: (payload: CalcSavePayload) =>
    api.post<{ id: string }>('/calculator/save', payload),

  getHistory: () =>
    api.get<CalcSnapshot[]>('/calculator/history'),
}
