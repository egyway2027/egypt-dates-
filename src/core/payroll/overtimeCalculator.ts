import { calculateDailyRate } from './dailyRate';

/**
 * احتساب أجر ساعات العمل الإضافية
 */
export function calculateOvertimePay(
  basicSalary: number,
  overtimeHours: number,
  dailyHours: number = 8,
  factor: number = 1.0,
  standardDays: number = 30
): number {
  if (overtimeHours <= 0) return 0;
  const dailyRate = calculateDailyRate(basicSalary, standardDays);
  const hourlyRate = dailyRate / dailyHours;
  const total = hourlyRate * factor * overtimeHours;
  return Math.round(total * 100) / 100;
}
