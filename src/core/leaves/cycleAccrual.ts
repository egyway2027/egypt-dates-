/**
 * احتساب استحقاق الإجازات بنظام الدورات (23 عمل / 7 إجازة)
 */
export function calculateCycleLeaveAccrual(actualWorkDays: number, cycleLeaveDays: number = 7, cycleWorkDays: number = 23): number {
  if (cycleWorkDays <= 0) return 0;
  const accrual = (cycleLeaveDays / cycleWorkDays) * actualWorkDays;
  return Math.round(accrual * 100) / 100;
}

/**
 * حساب القيمة المالية لرصيد الإجازات المتبقي عند نهاية الخدمة أو التسوية
 */
export function valueLeaveBalance(balanceDays: number, dailyRate: number): number {
  return Math.round(balanceDays * dailyRate * 100) / 100;
}
