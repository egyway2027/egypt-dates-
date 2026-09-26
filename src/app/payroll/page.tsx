'use client';

import React, { useState } from 'react';

interface EmployeePayrollState {
  code: string;
  name: string;
  position: string;
  basicSalary: number;
  unpaidAbsenceDays: number;
  overtimeHours: number;
  bonuses: number;
  loanInstallment: number;
  penalties: number;
}

export default function PayrollPage() {
  // بيانات الموظفين المأخوذة من شيت "تقفيل المرتبات" و"كشف الرواتب" الفعلي
  const [payrollList, setPayrollList] = useState<EmployeePayrollState[]>([
    { code: 'E001', name: 'مصطفى فريج فؤاد', position: 'مدير الشركة', basicSalary: 15000, unpaidAbsenceDays: 0, overtimeHours: 12, bonuses: 1500, loanInstallment: 0, penalties: 0 },
    { code: 'E002', name: 'أحمد سعد أحمد إبراهيم', position: 'مدير مصنع', basicSalary: 35000, unpaidAbsenceDays: 1, overtimeHours: 18.5, bonuses: 700, loanInstallment: 1000, penalties: 0 },
    { code: 'E003', name: 'عمرو محمود محمد علي', position: 'مدير إنتاج', basicSalary: 25000, unpaidAbsenceDays: 0, overtimeHours: 24, bonuses: 2500, loanInstallment: 1500, penalties: 0 },
    { code: 'E004', name: 'محمود برسي محمود برسي', position: 'مشرف تشغيل', basicSalary: 11000, unpaidAbsenceDays: 2, overtimeHours: 15, bonuses: 300, loanInstallment: 1000, penalties: 100 },
    { code: 'E005', name: 'أحمد عاطف أحمد محمدين', position: 'شؤون إدارية', basicSalary: 11000, unpaidAbsenceDays: 2, overtimeHours: 0, bonuses: 800, loanInstallment: 0, penalties: 150 },
  ]);

  // تحديث القيم تفاعلياً
  const handleValueChange = (code: string, field: keyof EmployeePayrollState, val: number) => {
    setPayrollList((prev) =>
      prev.map((emp) => (emp.code === code ? { ...emp, [field]: Math.max(0, val) } : emp))
    );
  };

  // الحسابات المحاسبية الدقيقة
  const calculatedPayroll = payrollList.map((emp) => {
    const dailyRate = Math.round((emp.basicSalary / 30) * 100) / 100;
    const hourlyRate = Math.round((dailyRate / 8) * 100) / 100;
    const absenceDeduction = Math.round(emp.unpaidAbsenceDays * dailyRate * 100) / 100;
    const overtimePay = Math.round(emp.overtimeHours * hourlyRate * 100) / 100;
    const gross = Math.round((emp.basicSalary - absenceDeduction + overtimePay + emp.bonuses) * 100) / 100;
    const deductions = Math.round((emp.loanInstallment + emp.penalties) * 100) / 100;
    const net = Math.round((gross - deductions) * 100) / 100;

    return {
      ...emp,
      dailyRate,
      hourlyRate,
      absenceDeduction,
      overtimePay,
      gross,
      deductions,
      net,
    };
  });

  const totalNet = calculatedPayroll.reduce((acc, curr) => acc + curr.net, 0);

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            مسير الرواتب التفاعلي والتقفيل الشهري الشامل
          </h1>
          <p className="text-xs text-slate-500">
            ربط آلي: أجر اليوم (أساسي ÷ 30) + أجر الإضافي - خصم الغياب - قسط السلفة - الجزاءات = صافي الراتب المستحق
          </p>
        </div>
        <div className="rounded-xl bg-emerald-800 px-4 py-2 text-white text-center">
          <span className="text-[10px] block opacity-80">إجمالي صافي الرواتب المستحقة</span>
          <span className="text-base font-black font-mono">{totalNet.toLocaleString()} ج.م</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-right text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="p-3">الكود</th>
              <th className="p-3">اسم الموظف</th>
              <th className="p-3">الراتب الأساسي</th>
              <th className="p-3">أجر اليوم</th>
              <th className="p-3 text-rose-600">غياب (أيام)</th>
              <th className="p-3 text-rose-600">خصم الغياب</th>
              <th className="p-3 text-blue-600">ساعات إضافي</th>
              <th className="p-3 text-blue-600">أجر الإضافي</th>
              <th className="p-3">حوافز</th>
              <th className="p-3 text-amber-600">قسط سلفة</th>
              <th className="p-3 text-rose-600">جزاءات</th>
              <th className="p-3 font-black text-emerald-800 dark:text-emerald-400">صافي الراتب</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {calculatedPayroll.map((emp) => (
              <tr key={emp.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{emp.code}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">
                  {emp.name}
                  <span className="block text-[10px] font-normal text-slate-400">{emp.position}</span>
                </td>
                <td className="p-3 font-semibold">{emp.basicSalary.toLocaleString()}</td>
                <td className="p-3 font-mono text-slate-500">{emp.dailyRate.toFixed(2)}</td>
                
                {/* حقل غياب تفاعلي */}
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={emp.unpaidAbsenceDays}
                    onChange={(e) => handleValueChange(emp.code, 'unpaidAbsenceDays', parseFloat(e.target.value) || 0)}
                    className="w-14 rounded border border-rose-300 bg-rose-50/30 p-1 text-center font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-400"
                  />
                </td>
                <td className="p-3 text-rose-600 font-mono">({emp.absenceDeduction.toFixed(2)})</td>

                {/* حقل ساعات إضافي تفاعلي */}
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={emp.overtimeHours}
                    onChange={(e) => handleValueChange(emp.code, 'overtimeHours', parseFloat(e.target.value) || 0)}
                    className="w-16 rounded border border-blue-300 bg-blue-50/30 p-1 text-center font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-400"
                  />
                </td>
                <td className="p-3 text-blue-600 font-mono">+{emp.overtimePay.toFixed(2)}</td>

                {/* حوافز */}
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={emp.bonuses}
                    onChange={(e) => handleValueChange(emp.code, 'bonuses', parseFloat(e.target.value) || 0)}
                    className="w-16 rounded border border-slate-300 bg-white p-1 text-center font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </td>

                {/* قسط السلفة */}
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={emp.loanInstallment}
                    onChange={(e) => handleValueChange(emp.code, 'loanInstallment', parseFloat(e.target.value) || 0)}
                    className="w-16 rounded border border-amber-300 bg-amber-50/30 p-1 text-center font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                  />
                </td>

                {/* جزاءات */}
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={emp.penalties}
                    onChange={(e) => handleValueChange(emp.code, 'penalties', parseFloat(e.target.value) || 0)}
                    className="w-16 rounded border border-rose-300 bg-rose-50/30 p-1 text-center font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-400"
                  />
                </td>

                {/* صافي المستحق النهائي */}
                <td className="p-3 font-black text-emerald-800 dark:text-emerald-400 font-mono text-sm whitespace-nowrap">
                  {emp.net.toLocaleString()} ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
