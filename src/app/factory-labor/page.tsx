import React from 'react';

const factoryLaborBatches = [
  { id: 'FL-01', category: 'عمالة رجال بالمصنع', period: 'سبتمبر 2026', workersCount: 42, shiftsCount: 26, totalAmount: 982540.0, paid: 600000.0, balance: 382540.0 },
  { id: 'FL-02', category: 'عمالة سيدات بالمصنع (فرز وتعبئة)', period: 'سبتمبر 2026', workersCount: 78, shiftsCount: 26, totalAmount: 1073749.0, paid: 750000.0, balance: 323749.0 },
];

export default function FactoryLaborPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          تشغيل وتكاليف عمالة المصنع (رجال وسيدات)
        </h1>
        <p className="text-xs text-slate-500">
          حصر ورديات الإنتاج، محطة الفرز، والتعبئة بمصنع التمور
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {factoryLaborBatches.map((batch) => (
          <div key={batch.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{batch.category}</h3>
            <p className="mt-1 text-xs text-slate-400">عن فترة: {batch.period} — عدد العمال: {batch.workersCount} عامل</p>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">إجمالي التكلفة</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{batch.totalAmount.toLocaleString()} ج.م</p>
              </div>
              <div>
                <span className="text-slate-400">المسدد</span>
                <p className="font-bold text-emerald-600">{batch.paid.toLocaleString()} ج.م</p>
              </div>
              <div>
                <span className="text-slate-400">المتبقي</span>
                <p className="font-bold text-rose-600">{batch.balance.toLocaleString()} ج.م</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
