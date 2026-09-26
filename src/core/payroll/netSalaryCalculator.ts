import { PayrollCalculationInput, PayrollCalculationResult } from '@/types/payroll';
import { calculateDailyRate } from './dailyRate';
import { calculateAbsenceDeduction, calculateTotalDeductions } from './deductionsCalculator';
import { calculateOvertimePay } from './overtimeCalculator';

/**
 * المحرك المحاسبي الشامل لاحتساب صافي الراتب المستحق
 */
export function calculateNetSalary(input: PayrollCalculationInput): PayrollCalculationResult {
  const standardDays = input.standardMonthDays ?? 30;
  const dailyHours = input.standardDailyHours ?? 8;
  const overtimeFactor = input.overtimeFactor ?? 1.0;

  const dailyRate = calculateDailyRate(input.basicSalary, standardDays);
  const absenceDeduction = calculateAbsenceDeduction(input.basicSalary, input.unpaidAbsenceDays, standardDays);
  const overtimePay = calculateOvertimePay(input.basicSalary, input.overtimeHours, dailyHours, overtimeFactor, standardDays);

  // إجمالي المستحق = الراتب الأساسي - خصم الغياب + أجر الإضافي + الحوافز
  const grossPay = Math.round((input.basicSalary - absenceDeduction + overtimePay + (input.bonuses || 0)) * 100) / 100;

  // إجمالي الاستقطاعات = قسط السلف + الجزاءات
  const totalDeductions = calculateTotalDeductions(input.loanInstallment, input.penalties);

  // صافي الراتب النهائي
  const netSalary = Math.round((grossPay - totalDeductions) * 100) / 100;

  return {
    dailyRate,
    absenceDeduction,
    overtimePay,
    grossPay,
    totalDeductions,
    netSalary,
  };
}
