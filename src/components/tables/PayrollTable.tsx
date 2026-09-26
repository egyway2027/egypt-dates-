import React from 'react';

export interface PayrollRow {
  code: string;
  name: string;
  basicSalary: number;
  dailyRate: number;
  absenceDeduction: number;
  overtimePay: number;
  bonuses: number;
  grossPay: number;
  loanInstallment: number;
  penalties: number;
  netPay: number;
}

interface Props {
  rows: PayrollRow[];
}

export const PayrollTable: React.FC<Props> = ({ rows }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="p-3">الكود</th>
            <th className="p-3">اسم الموظف</th>
            <th className="p-3">الراتب الأساسي</th>
            <th className="p-3">أجر اليوم</th>
            <th className="p-3">خصم الغياب</th>
            <th className="p-3">أجر الإضافي</th>
            <th className="p-3">حوافز</th>
            <th className="p-3 font-bold text-slate-900 dark:text-white">إجمالي المستحق</th>
            <th className="p-3">قسط السلفة</th>
            <th className="p-3">جزاءات</th>
            <th className="p-3 font-black text-emerald-800 dark:text-emerald-400">صافي المستحق</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <tr key={row.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
              <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{row.code}</td>
              <td className="p-3 font-medium text-slate-900 dark:text-white">{row.name}</td>
              <td className="p-3">{row.basicSalary.toLocaleString()}</td>
              <td className="p-3">{row.dailyRate.toFixed(2)}</td>
              <td className="p-3 text-rose-600">{row.absenceDeduction > 0 ? row.absenceDeduction.toFixed(2) : '0.00'}</td>
              <td className="p-3 text-emerald-600">{row.overtimePay.toFixed(2)}</td>
              <td className="p-3">{row.bonuses.toFixed(2)}</td>
              <td className="p-3 font-bold">{row.grossPay.toFixed(2)}</td>
              <td className="p-3 text-amber-600">{row.loanInstallment.toFixed(2)}</td>
              <td className="p-3 text-rose-600">{row.penalties.toFixed(2)}</td>
              <td className="p-3 font-black text-emerald-800 dark:text-emerald-400">{row.netPay.toFixed(2)} ج.م</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
