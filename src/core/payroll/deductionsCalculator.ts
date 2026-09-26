import { calculateDailyRate } from './dailyRate';

/**
 * احتساب استقطاعات الغياب المباشر
 */
export function calculateAbsenceDeduction(
  basicSalary: number,
  unpaidAbsenceDays: number,
  standardDays: number = 30
): number {
  if (unpaidAbsenceDays <= 0) return 0;
  const dailyRate = calculateDailyRate(basicSalary, standardDays);
  const deduction = unpaidAbsenceDays * dailyRate;
  return Math.round(deduction * 100) / 100;
}

/**
 * احتساب إجمالي الاستقطاعات (سلف + جزاءات)
 */
export function calculateTotalDeductions(loanInstallment: number, penalties: number): number {
  return Math.round(((loanInstallment || 0) + (penalties || 0)) * 100) / 100;
}
