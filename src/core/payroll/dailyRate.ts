/**
 * احتساب أجر اليوم طبقاً لقاعدة 30 يوماً التعاقدية المعيارية
 */
export function calculateDailyRate(basicSalary: number, standardDays: number = 30): number {
  if (standardDays <= 0) return 0;
  const rate = basicSalary / standardDays;
  return Math.round(rate * 100) / 100;
}
