export interface ShiftCostInput {
  workersCount: number;
  dailyRate: number;
  transportAllowance?: number;
  overtimeRate?: number;
  penalties?: number;
}

export interface ContractorCostInput {
  quantity: number;
  unitPrice: number;
  retentionPercent: number; // e.g. 0.10 for 10%
  transfersPaid: number;
}
