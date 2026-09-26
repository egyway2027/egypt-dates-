import React from 'react';

const employees = [
  { code: 'E001', name: 'مصطفى فريج فؤاد', position: 'مدير تنفيذي', location: 'إدارة المزرعة', salary: 15000, cycle: '23 عمل / 7 إجازة', status: 'نشط' },
  { code: 'E002', name: 'أحمد سعد أحمد إبراهيم', position: 'مدير مصنع', location: 'مصنع التمور', salary: 35000, cycle: '23 عمل / 7 إجازة', status: 'نشط' },
  { code: 'E003', name: 'عمرو محمود محمد علي', position: 'مهندس جودة وتصنيع', location: 'مصنع التمور', salary: 25000, cycle: '23 عمل / 7 إجازة', status: 'نشط' },
  { code: 'E004', name: 'محمود برسي محمود', position: 'مشرف إنتاج وتشغيل', location: 'مصنع العجوة', salary: 11000, cycle: '23 عمل / 7 إجازة', status: 'نشط' },
  { code: 'E005', name: 'أحمد عاطف أحمد محمدين', position: 'أخصائي شؤون إدارية', location: 'المقر الرئيسي', salary: 11000, cycle: '26 عمل / 4 إجازة', status: 'نشط' },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          سجل الموظفين والبيانات التعاقدية
        </h1>
        <p className="text-xs text-slate-500">
          حصر بيانات العاملين، الرواتب الأساسية، مواقع العمل، ونظام دورات التشغيل والإجازات
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-right text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="p-3">الكود</th>
              <th className="p-3">اسم الموظف</th>
              <th className="p-3">الوظيفة</th>
              <th className="p-3">الموقع / الإدارة</th>
              <th className="p-3">الراتب الأساسي (ج.م)</th>
              <th className="p-3">نظام الورديات</th>
              <th className="p-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {employees.map((row) => (
              <tr key={row.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{row.code}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                <td className="p-3">{row.position}</td>
                <td className="p-3 text-slate-500">{row.location}</td>
                <td className="p-3 font-semibold">{row.salary.toLocaleString()}</td>
                <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{row.cycle}</td>
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
