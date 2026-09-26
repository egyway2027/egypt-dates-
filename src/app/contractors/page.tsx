import React from 'react';

const contractorsData = [
  {
    id: 'CNT-01',
    name: 'إسلام الأزلي',
    operation: 'تكييس عراجين وجمع تمور (حتى 22/9/2026)',
    quantity: 33969,
    unitPrice: 22.0, // متوسط الفئتين (20 ج و 26 ج)
    totalAmount: 746094.0,
    paidAmount: 250000.0,
    remainingBalance: 496094.0,
    status: 'ساري الصرف',
  },
  {
    id: 'CNT-02',
    name: 'أحمد خليفة',
    operation: 'تشغيل وتوريد عمالة رجال المصنع',
    quantity: 1,
    unitPrice: 1514668.0,
    totalAmount: 1514668.0,
    paidAmount: 600000.0,
    remainingBalance: 914668.0,
    status: 'ساري الصرف',
  },
  {
    id: 'CNT-03',
    name: 'أبو عاصم',
    operation: 'أعمال فصل وتجهيز الفسائل بالمزرعة',
    quantity: 4985,
    unitPrice: 75.0,
    totalAmount: 373875.0,
    paidAmount: 200000.0,
    remainingBalance: 173875.0,
    status: 'مطابقة حصر',
  },
];

export default function ContractorsPage() {
  const totalDue = contractorsData.reduce((acc, curr) => acc + curr.remainingBalance, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          مستخلصات المقاولين والعمليات الزراعية
        </h1>
        <p className="text-xs text-slate-500">
          متابعة حصر الأعمال المنفذة، الدفعات المحولة، وصافي المستحق النهائي لمقاولي المزرعة والمصنع
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">إجمالي قيمة الأعمال المنفذة</span>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {contractorsData.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()} ج.م
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">إجمالي المسدد من الخزينة</span>
          <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {contractorsData.reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString()} ج.م
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
          <span className="text-xs text-rose-600 dark:text-rose-400">صافي المستحق القائم للصرف</span>
          <p className="mt-1 text-xl font-bold text-rose-700 dark:text-rose-300">
            {totalDue.toLocaleString()} ج.م
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-right text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="p-3">كود المقاول</th>
              <th className="p-3">اسم المقاول</th>
              <th className="p-3">طبيعة الأعمال المنفذة</th>
              <th className="p-3">إجمالي الأعمال (ج.م)</th>
              <th className="p-3">المسدد (وصل)</th>
              <th className="p-3 font-bold text-slate-900 dark:text-white">صافي المتبقي</th>
              <th className="p-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {contractorsData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{row.id}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                <td className="p-3">{row.operation}</td>
                <td className="p-3 font-semibold">{row.totalAmount.toLocaleString()}</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{row.paidAmount.toLocaleString()}</td>
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">
                  {row.remainingBalance.toLocaleString()} ج.م
                </td>
                <td className="p-3">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
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
