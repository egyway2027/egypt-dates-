import { ShiftCostInput } from '@/types/labor';

/**
 * احتساب صافي تكلفة وردية المصنع اليومية (سيدات أو رجال)
 */
export function calculateFactoryShiftCost(input: ShiftCostInput): { totalGross: number; netPayable: number } {
  const baseCost = input.workersCount * input.dailyRate;
  const transport = input.transportAllowance || 0;
  const overtime = input.overtimeRate || 0;
  const penalties = input.penalties || 0;

  const totalGross = Math.round((baseCost + transport + overtime) * 100) / 100;
  const netPayable = Math.round((totalGross - penalties) * 100) / 100;

  return { totalGross, netPayable };
}
