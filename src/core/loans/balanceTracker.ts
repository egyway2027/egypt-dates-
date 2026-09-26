/**
 * تتبع رصيد السلفة وحساب إجمالي المسدد والمتبقي لمنع تكرار الخصم
 */
export function trackLoanBalance(totalAmount: number, totalPaid: number) {
  const remaining = Math.max(0, totalAmount - totalPaid);
  const isPaidOff = remaining === 0;

  return {
    totalAmount,
    totalPaid: Math.round(totalPaid * 100) / 100,
    remainingAmount: Math.round(remaining * 100) / 100,
    isPaidOff,
    status: isPaidOff ? 'مسدد بالكامل' : 'ساري الاستقطاع',
  };
}
