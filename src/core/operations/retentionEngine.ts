import { ContractorCostInput } from '@/types/labor';
import { calculatePieceRateWork } from './pieceRateCalculator';

/**
 * حساب مبالغ التأمين المحتجزة والدفعات المستحقة للمقاول
 */
export function calculateContractorClearance(input: ContractorCostInput) {
  const totalAmount = calculatePieceRateWork(input.quantity, input.unitPrice);
  const retentionAmount = Math.round(totalAmount * input.retentionPercent * 100) / 100;
  const netAfterRetention = totalAmount - retentionAmount;
  const balance = Math.round((totalAmount - input.transfersPaid) * 100) / 100;
  const pendingTransfer = Math.max(0, netAfterRetention - input.transfersPaid);

  return {
    totalAmount,
    retentionAmount,
    netAfterRetention,
    transfersPaid: input.transfersPaid,
    remainingBalance: balance,
    requiredTransfer: Math.round(pendingTransfer * 100) / 100,
  };
}
