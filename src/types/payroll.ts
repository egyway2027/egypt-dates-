export interface PayrollCalculationInput {
  basicSalary: number;
  unpaidAbsenceDays: number;
  overtimeHours: number;
  bonuses: number;
  loanInstallment: number;
  penalties: number;
  standardMonthDays?: number;
  standardDailyHours?: number;
  overtimeFactor?: number;
}

export interface PayrollCalculationResult {
  dailyRate: number;
  absenceDeduction: number;
  overtimePay: number;
  grossPay: number;
  totalDeductions: number;
  netSalary: number;
}
