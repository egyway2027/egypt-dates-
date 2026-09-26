/**
 * احتساب تكلفة أعمال المقاولين بالقطعة (فصل فسائل، تكييس، جمع وفرز)
 */
export function calculatePieceRateWork(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}
