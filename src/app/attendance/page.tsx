import React from 'react';

const attendanceRecords = [
  { id: 'ATT-101', code: 'E001', name: 'مصطفى فريج فؤاد', date: '2026-09-24', timeIn: '08:00', timeOut: '16:00', totalHours: 8.0, regularHours: 8.0, overtimeHours: 0.0, otAmount: 0.0 },
  { id: 'ATT-102', code: 'E002', name: 'أحمد سعد أحمد إبراهيم', date: '2026-09-24', timeIn: '08:00', timeOut: '19:30', totalHours: 11.5, regularHours: 8.0, overtimeHours: 3.5, otAmount: 510.42 },
  { id: 'ATT-103', code: 'E003', name: 'عمرو محمود محمد علي', date: '2026-09-24', timeIn: '08:00', timeOut: '18:00', totalHours: 10.0, regularHours: 8.0, overtimeHours: 2.0, otAmount: 208.33 },
  { id: 'ATT-104', code: 'E004', name: 'محمود برسي محمود', date: '2026-09-24', timeIn: '07:30', timeOut: '18:30', totalHours: 11.0, regularHours: 8.0, overtimeHours: 3.0, otAmount: 137.50 },
  { id: 'ATT-105', code: 'E005', name: 'أحمد عاطف أحمد', date: '2026-09-24', timeIn: '08:00', timeOut: '16:00', totalHours: 8.0, regularHours: 8.0, overtimeHours: 0.0, otAmount: 0.0 },
];

export default function AttendancePage() {
  const totalOtHours = attendanceRecords.reduce((acc, curr) => acc + curr.overtimeHours, 0);
  const totalOtPay = attendanceRecords.reduce((acc, curr) => acc + curr.otAmount, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          سجل الحضور والشيفتات والساعات الإضافية
        </h1>
        <p className="text-xs text-slate-500">
          حساب ساعات العمل آلياً وفصل ساعات العمل الأساسية (8 ساعات) عن الساعات الإضافية المعتمدة
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">عدد العاملين المسجلين بالوردية</span>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {attendanceRecords.length} عمال
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">إجمالي الساعات الإضافية المعتمدة</span>
          <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
            {totalOtHours.toFixed(1)} ساعة
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">القيمة المالية المستحقة للإضافي</span>
          <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalOtPay.toFixed(2)} ج.م
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-right text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="p-3">الكود</th>
              <th className="p-3">اسم الموظف</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">الحضور</th>
              <th className="p-3">الانصراف</th>
              <th className="p-3">إجمالي الساعات</th>
              <th className="p-3">الأساسي (8س)</th>
              <th className="p-3 font-bold text-blue-600 dark:text-blue-400">إضافي (+فوق 8)</th>
              <th className="p-3 font-bold text-emerald-700 dark:text-emerald-400">قيمة الإضافي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {attendanceRecords.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{row.code}</td>
                <td className="p-3 font-medium text-slate-900 dark:text-white">{row.name}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3 font-mono">{row.timeIn}</td>
                <td className="p-3 font-mono">{row.timeOut}</td>
                <td className="p-3 font-bold">{row.totalHours.toFixed(2)}</td>
                <td className="p-3 text-slate-500">{row.regularHours.toFixed(2)}</td>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                  {row.overtimeHours > 0 ? `+${row.overtimeHours.toFixed(2)}` : '0.00'}
                </td>
                <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">
                  {row.otAmount > 0 ? `${row.otAmount.toFixed(2)} ج.م` : '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
