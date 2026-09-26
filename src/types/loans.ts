export interface LoanScheduleItem {
  installmentNumber: number;
  monthYear: string;
  amount: number;
  isPaid: boolean;
}

export interface LoanCalculationInput {
  totalAmount: number;
  installmentsCount: number;
  startMonth: string; // e.g. "Feb 2026"
}
