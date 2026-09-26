import { LoanCalculationInput, LoanScheduleItem } from '@/types/loans';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * توليد جدول الأقساط الشهرية آلياً بناء على شهر البدء وعدد الأقساط
 */
export function generateLoanSchedule(input: LoanCalculationInput): LoanScheduleItem[] {
  const { totalAmount, installmentsCount, startMonth } = input;
  if (installmentsCount <= 0) return [];

  const [mStr, yStr] = startMonth.split(' ');
  let currentMonthIdx = MONTHS.indexOf(mStr);
  let currentYear = parseInt(yStr, 10);

  const installmentAmount = Math.round((totalAmount / installmentsCount) * 100) / 100;
  const schedule: LoanScheduleItem[] = [];

  for (let i = 1; i <= installmentsCount; i++) {
    const monthLabel = `${MONTHS[currentMonthIdx]} ${currentYear}`;
    schedule.push({
      installmentNumber: i,
      monthYear: monthLabel,
      amount: installmentAmount,
      isPaid: false,
    });

    currentMonthIdx++;
    if (currentMonthIdx > 11) {
      currentMonthIdx = 0;
      currentYear++;
    }
  }

  return schedule;
}
