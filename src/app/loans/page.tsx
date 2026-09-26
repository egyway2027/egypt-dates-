import React from 'react';

const loansData = [
  { id: 'L001', code: 'E002', name: 'أحمد سعد أحمد إبراهيم', totalAmount: 12000, installment: 1000, paid: 2000, remaining: 10000, startMonth: 'Feb 2026', status: 'ساري الاستقطاع' },
  { id: 'L002', code: 'E004', name: 'محمود برسي محمود', totalAmount: 6000, installment: 1000, paid: 6000, remaining: 0, startMonth: 'Jan 2026', status: 'مسدد بالكامل' },
  { id: 'L003', code: 'E005', name: 'أحمد عاطف أحمد محمدين', totalAmount: 3000, installment: 500, paid: 1000, remaining: 2000, startMonth: 'Mar 2026', status: 'ساري الاستقطاع' },
];

export default function LoansPage() {
  const totalOutstanding = loansData.reduce((acc, curr) => acc + curr.remaining, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          سجل السلف والقروض والأقساط المستردة
        </h1>
        <p className="text-xs text-slate-500">
          متابعة جدول سداد السلف الشهرية والخصم المباشر من مسير الرواتب الآلي
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">إجمالي مبالغ السلف الممنوحة</span>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {loansData.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()} ج.م
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">إجمالي الأقساط المحصلة</span>
          <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {loansData.reduce((acc, curr) => acc + curr.paid, 0).toLocaleString()} ج.م
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <span className="text-xs text-amber-700 dark:text-amber-400">إجمالي الأرصدة القائمة بذمة العاملين</span>
          <p className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-300">
            {totalOutstanding.toLocaleString()} ج.م
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-right text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="p-3">كود السلفة</th>
              <th className="p-3">كود الموظف</th>
              <th className="p-3">اسم الموظف</th>
              <th className="p-3">إجمالي السلفة</th>
              <th className="p-3">القسط الشهري</th>
              <th className="p-3">المسدد</th>
              <th className="p-3 font-bold text-slate-900 dark:text-white">المتبقي</th>
              <th className="p-3">بداية الخصم</th>
              <th className="p-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loansData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{row.id}</td>
                <td className="p-3 font-mono">{row.code}</td>
                <td className="p-3 font-medium text-slate-900 dark:text-white">{row.name}</td>
                <td className="p-3 font-semibold">{row.totalAmount.toLocaleString()}</td>
                <td className="p-3 text-amber-600">{row.installment.toLocaleString()}</td>
                <td className="p-3 text-emerald-600">{row.paid.toLocaleString()}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{row.remaining.toLocaleString()} ج.م</td>
                <td className="p-3">{row.startMonth}</td>
                <td className="p-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                      row.remaining === 0
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
