'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// 1. هياكل البيانات والأنواع (Types)
// ==========================================
export interface Employee {
  code: string;
  name: string;
  position: string;
  location: string;
  basicSalary: number;
}

export interface AttendanceRecord {
  id: string;
  empCode: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  overtimePay: number;
  notes?: string;
}

export interface LoanRecord {
  id: string;
  empCode: string;
  date: string;
  totalAmount: number;
  monthlyInstallment: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'ساري' | 'خالص';
}

export interface PenaltyRecord {
  id: string;
  empCode: string;
  date: string;
  type: 'تأخير' | 'غياب' | 'مخالفة تشغيل';
  days: number;
  amount: number;
  reason: string;
}

// قائمة موظفي الشركة الأساسية (من واقع الشيتات الرسمية)
const INITIAL_EMPLOYEES: Employee[] = [
  { code: 'E001', name: 'مصطفى فريج فؤاد', position: 'مدير الشركة', location: 'إدارة - المزرعة', basicSalary: 15000 },
  { code: 'E002', name: 'أحمد سعد أحمد إبراهيم', position: 'مدير مصنع', location: 'إدارة - المزرعة', basicSalary: 35000 },
  { code: 'E003', name: 'عمرو محمود محمد علي', position: 'مدير إنتاج', location: 'مصنع التمور', basicSalary: 25000 },
  { code: 'E004', name: 'محمود برسي محمود برسي', position: 'مشرف تشغيل (أوبريتور)', location: 'مصنع التمور', basicSalary: 11000 },
  { code: 'E005', name: 'أحمد عاطف أحمد محمدين', position: 'أخصائي شؤون إدارية', location: 'المقر الرئيسي', basicSalary: 11000 },
  { code: 'E011', name: 'محمد منصور محمد بكري', position: 'فني تشغيل خطوط', location: 'مصنع التمور', basicSalary: 12000 },
];

export default function ProfessionalERPPage() {
  // ==========================================
  // 2. إدارة الحالة وحفظ البيانات محلياً
  // ==========================================
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [penalties, setPenalties] = useState<PenaltyRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'payroll' | 'attendance' | 'loans' | 'penalties'>('payroll');

  // نوافذ منبثقة تفاعلية (Modals)
  const [selectedEmpFor360, setSelectedEmpFor360] = useState<Employee | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

  // استرجاع البيانات من LocalStorage عند بدء التشغيل
  useEffect(() => {
    const savedAtt = localStorage.getItem('erp_attendance');
    const savedLoans = localStorage.getItem('erp_loans');
    const savedPenalties = localStorage.getItem('erp_penalties');
    if (savedAtt) setAttendance(JSON.parse(savedAtt));
    if (savedLoans) setLoans(JSON.parse(savedLoans));
    if (savedPenalties) setPenalties(JSON.parse(savedPenalties));
  }, []);

  // الحفظ التلقائي عند أي تعديل
  useEffect(() => {
    localStorage.setItem('erp_attendance', JSON.stringify(attendance));
  }, [attendance]);
  useEffect(() => {
    localStorage.setItem('erp_loans', JSON.stringify(loans));
  }, [loans]);
  useEffect(() => {
    localStorage.setItem('erp_penalties', JSON.stringify(penalties));
  }, [penalties]);

  // ==========================================
  // 3. المحركات الحسابية المركزية
  // ==========================================
  // احتساب أجر اليوم وأجر الساعة طبقاً لمعايير الشركة
  const getRates = (basic: number) => {
    const dailyRate = Math.round((basic / 30) * 100) / 100;
    const hourlyRate = Math.round((dailyRate / 8) * 100) / 100;
    return { dailyRate, hourlyRate };
  };

  // تفريغ ساعات الشيفت وفرز ما فوق 8 ساعات كإضافي
  const calculateShiftHours = (tIn: string, tOut: string, hourlyRate: number) => {
    if (!tIn || !tOut) return { totalHours: 0, regularHours: 0, overtimeHours: 0, overtimePay: 0 };
    const [hIn, mIn] = tIn.split(':').map(Number);
    const [hOut, mOut] = tOut.split(':').map(Number);
    let mStart = hIn * 60 + mIn;
    let mEnd = hOut * 60 + mOut;
    if (mEnd < mStart) mEnd += 24 * 60; // معالجة الشيفت الليلي عابر منتصف الليل

    const totalHours = Math.round(((mEnd - mStart) / 60) * 100) / 100;
    const regularHours = Math.min(totalHours, 8.0);
    const overtimeHours = Math.max(0, Math.round((totalHours - 8.0) * 100) / 100);
    const overtimePay = Math.round(overtimeHours * hourlyRate * 100) / 100;
    return { totalHours, regularHours, overtimeHours, overtimePay };
  };

  // محرك تجميع الرواتب اللحظي لكافة الموظفين
  const payrollSummary = useMemo(() => {
    return employees.map((emp) => {
      const { dailyRate, hourlyRate } = getRates(emp.basicSalary);

      // تجميع ساعات الحضور والإضافي للموظف
      const empAttendance = attendance.filter((a) => a.empCode === emp.code);
      const totalDaysWorked = empAttendance.length;
      const totalOtHours = empAttendance.reduce((acc, a) => acc + a.overtimeHours, 0);
      const totalOtPay = empAttendance.reduce((acc, a) => acc + a.overtimePay, 0);

      // تجميع أقساط السلف القائمة
      const empLoans = loans.filter((l) => l.empCode === emp.code && l.status === 'ساري');
      const monthlyLoanDeduction = empLoans.reduce((acc, l) => acc + Math.min(l.monthlyInstallment, l.remainingAmount), 0);

      // تجميع الخصومات والجزاءات
      const empPenalties = penalties.filter((p) => p.empCode === emp.code);
      const totalPenalties = empPenalties.reduce((acc, p) => acc + p.amount, 0);

      // حساب إجمالي المستحق وصافي الراتب النهائي
      const grossPay = Math.round((emp.basicSalary + totalOtPay) * 100) / 100;
      const totalDeductions = Math.round((monthlyLoanDeduction + totalPenalties) * 100) / 100;
      const netPay = Math.round((grossPay - totalDeductions) * 100) / 100;

      return {
        ...emp,
        dailyRate,
        hourlyRate,
        totalDaysWorked,
        totalOtHours,
        totalOtPay,
        monthlyLoanDeduction,
        totalPenalties,
        grossPay,
        totalDeductions,
        netPay,
      };
    });
  }, [employees, attendance, loans, penalties]);

  // ==========================================
  // 4. معالجة إدخالات النوافذ المنبثقة (Forms State)
  // ==========================================
  const [attForm, setAttForm] = useState({ empCode: 'E002', date: '2026-09-27', timeIn: '08:00', timeOut: '19:30', notes: '' });
  const [loanForm, setLoanForm] = useState({ empCode: 'E002', amount: 6000, installment: 1000 });
  const [penForm, setPenForm] = useState<{ empCode: string; type: 'تأخير' | 'غياب' | 'مخالفة تشغيل'; days: number; reason: string }>({
    empCode: 'E002',
    type: 'غياب',
    days: 1,
    reason: 'غياب بدون إذن مسبق',
  });

  // إضافة حركة حضور
  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.code === attForm.empCode);
    if (!emp) return;
    const { hourlyRate } = getRates(emp.basicSalary);
    const { totalHours, regularHours, overtimeHours, overtimePay } = calculateShiftHours(attForm.timeIn, attForm.timeOut, hourlyRate);

    const newRec: AttendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-5)}`,
      empCode: attForm.empCode,
      date: attForm.date,
      timeIn: attForm.timeIn,
      timeOut: attForm.timeOut,
      totalHours,
      regularHours,
      overtimeHours,
      overtimePay,
      notes: attForm.notes,
    };
    setAttendance([newRec, ...attendance]);
    setIsAttendanceModalOpen(false);
  };

  // إضافة سلفة
  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: LoanRecord = {
      id: `L-${Date.now().toString().slice(-4)}`,
      empCode: loanForm.empCode,
      date: new Date().toISOString().split('T')[0],
      totalAmount: Number(loanForm.amount),
      monthlyInstallment: Number(loanForm.installment),
      paidAmount: 0,
      remainingAmount: Number(loanForm.amount),
      status: 'ساري',
    };
    setLoans([newLoan, ...loans]);
    setIsLoanModalOpen(false);
  };

  // إضافة جزاء مالي
  const handleSavePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.code === penForm.empCode);
    if (!emp) return;
    const { dailyRate } = getRates(emp.basicSalary);
    const calculatedAmount = Math.round(Number(penForm.days) * dailyRate * 100) / 100;

    const newPen: PenaltyRecord = {
      id: `PEN-${Date.now().toString().slice(-4)}`,
      empCode: penForm.empCode,
      date: new Date().toISOString().split('T')[0],
      type: penForm.type,
      days: Number(penForm.days),
      amount: calculatedAmount,
      reason: penForm.reason,
    };
    setPenalties([newPen, ...penalties]);
    setIsPenaltyModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100" dir="rtl">
      {/* الشريط العلوي والأزرار التشغيلية */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            شركة تمور مصر للتجارة — المنظومة التشغيلية المتكاملة
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة مباشرة للساعات، السلف، الجزاءات، وتقفيل الرواتب مع كشف حساب تحليلي لكل موظف
          </p>
        </div>

        {/* أزرار الإدخال والفتح الفوري للنوافذ المنبثقة */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
          >
            ⏱️ تسجيل شيفت / حضور
          </button>
          <button
            onClick={() => setIsLoanModalOpen(true)}
            className="rounded-xl bg-amber-600 hover:bg-amber-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
          >
            💵 صرف سلفة لموظف
          </button>
          <button
            onClick={() => setIsPenaltyModalOpen(true)}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
          >
            ⚠️ تسجيل جزاء / غياب
          </button>
        </div>
      </div>

      {/* تبويبات الانتقال بين العمليات التشغيلية */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'payroll' ? 'bg-emerald-900 text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400'
          }`}
        >
          📊 مسير الرواتب المباشر ({payrollSummary.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'attendance' ? 'bg-emerald-900 text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400'
          }`}
        >
          ⏱️ سجل الحضور والإضافي ({attendance.length})
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'loans' ? 'bg-emerald-900 text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400'
          }`}
        >
          💰 كشف السلف والأقساط ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('penalties')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'penalties' ? 'bg-emerald-900 text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400'
          }`}
        >
          🚫 سجل الجزاءات والاستقطاع ({penalties.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* عرض التبويب 1: مسير الرواتب المقفل آلياً                         */}
      {/* ============================================================== */}
      {activeTab === 'payroll' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3.5">الكود</th>
                <th className="p-3.5">اسم الموظف</th>
                <th className="p-3.5">الأساسي</th>
                <th className="p-3.5">أجر اليوم</th>
                <th className="p-3.5">أيام الحضور</th>
                <th className="p-3.5 text-blue-600 dark:text-blue-400">ساعات الإضافي</th>
                <th className="p-3.5 text-blue-600 dark:text-blue-400">قيمة الإضافي</th>
                <th className="p-3.5 text-amber-600 dark:text-amber-400">قسط سلفة</th>
                <th className="p-3.5 text-rose-600 dark:text-rose-400">جزاءات</th>
                <th className="p-3.5 font-black text-emerald-700 dark:text-emerald-400">صافي المستحق</th>
                <th className="p-3.5 text-center">الملف المالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payrollSummary.map((emp) => (
                <tr key={emp.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-mono font-bold text-slate-600 dark:text-slate-400">{emp.code}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {emp.name}
                    <span className="block text-[10px] font-normal text-slate-400">{emp.position}</span>
                  </td>
                  <td className="p-3.5 font-semibold">{emp.basicSalary.toLocaleString()} ج.م</td>
                  <td className="p-3.5 font-mono text-slate-500">{emp.dailyRate.toFixed(2)}</td>
                  <td className="p-3.5 font-bold">{emp.totalDaysWorked} يوم</td>
                  <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400 font-mono">
                    +{emp.totalOtHours.toFixed(1)} س
                  </td>
                  <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400 font-mono">
                    +{emp.totalOtPay.toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {emp.monthlyLoanDeduction > 0 ? `-${emp.monthlyLoanDeduction.toLocaleString()}` : '0.00'}
                  </td>
                  <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400 font-mono">
                    {emp.totalPenalties > 0 ? `-${emp.totalPenalties.toLocaleString()}` : '0.00'}
                  </td>
                  <td className="p-3.5 font-black text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    {emp.netPay.toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedEmpFor360(emp)}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-700 px-3 py-1.5 text-[11px] font-bold transition-colors"
                    >
                      كشف 360° 🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* عرض التبويب 2: سجل الحضور وتفاصيل الساعات الإضافية             */}
      {/* ============================================================== */}
      {activeTab === 'attendance' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3.5">كود الموظف</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">وقت الحضور</th>
                <th className="p-3.5">وقت الانصراف</th>
                <th className="p-3.5">إجمالي الساعات</th>
                <th className="p-3.5">الأساسي (8س)</th>
                <th className="p-3.5 text-blue-600 dark:text-blue-400 font-bold">إضافي (+فوق 8)</th>
                <th className="p-3.5 text-emerald-700 dark:text-emerald-400 font-bold">قيمة الإضافي</th>
                <th className="p-3.5">ملاحظات</th>
                <th className="p-3.5 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    لا توجد حركات حضور مسجلة. اضغط على «تسجيل شيفت / حضور» للبدء.
                  </td>
                </tr>
              ) : (
                attendance.map((rec) => {
                  const emp = employees.find((e) => e.code === rec.empCode);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-bold">
                        {emp?.name} <span className="font-mono text-slate-400">({rec.empCode})</span>
                      </td>
                      <td className="p-3.5">{rec.date}</td>
                      <td className="p-3.5 font-mono">{rec.timeIn}</td>
                      <td className="p-3.5 font-mono">{rec.timeOut}</td>
                      <td className="p-3.5 font-bold font-mono">{rec.totalHours.toFixed(2)} س</td>
                      <td className="p-3.5 text-slate-500 font-mono">{rec.regularHours.toFixed(2)} س</td>
                      <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {rec.overtimeHours > 0 ? `+${rec.overtimeHours.toFixed(2)} س` : '0.00'}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        {rec.overtimePay.toFixed(2)} ج.م
                      </td>
                      <td className="p-3.5 text-slate-400">{rec.notes || '—'}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setAttendance(attendance.filter((a) => a.id !== rec.id))}
                          className="text-rose-600 hover:text-rose-800 font-bold"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* عرض التبويب 3: السلف والقروض                                  */}
      {/* ============================================================== */}
      {activeTab === 'loans' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3.5">كود السلفة</th>
                <th className="p-3.5">الموظف</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">إجمالي السلفة</th>
                <th className="p-3.5">القسط الشهري</th>
                <th className="p-3.5">المسدد</th>
                <th className="p-3.5 text-rose-600 font-bold">المتبقي</th>
                <th className="p-3.5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    لا توجد سلف مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => {
                  const emp = employees.find((e) => e.code === loan.empCode);
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono font-bold text-slate-500">{loan.id}</td>
                      <td className="p-3.5 font-bold">{emp?.name} ({loan.empCode})</td>
                      <td className="p-3.5">{loan.date}</td>
                      <td className="p-3.5 font-semibold font-mono">{loan.totalAmount.toLocaleString()} ج.م</td>
                      <td className="p-3.5 font-mono text-amber-600 font-bold">{loan.monthlyInstallment.toLocaleString()} ج.م</td>
                      <td className="p-3.5 font-mono text-emerald-600">{loan.paidAmount.toLocaleString()} ج.م</td>
                      <td className="p-3.5 font-mono text-rose-600 font-black">{loan.remainingAmount.toLocaleString()} ج.م</td>
                      <td className="p-3.5">
                        <span className="rounded-md bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* عرض التبويب 4: سجل الجزاءات والخصومات                           */}
      {/* ============================================================== */}
      {activeTab === 'penalties' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3.5">رقم القيد</th>
                <th className="p-3.5">الموظف</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">نوع الجزاء</th>
                <th className="p-3.5">الأيام</th>
                <th className="p-3.5 text-rose-600 font-bold">قيمة الخصم (ج.م)</th>
                <th className="p-3.5">السبب والبيان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {penalties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    سجل الجزاءات نظيف تماماً.
                  </td>
                </tr>
              ) : (
                penalties.map((pen) => {
                  const emp = employees.find((e) => e.code === pen.empCode);
                  return (
                    <tr key={pen.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono font-bold text-slate-500">{pen.id}</td>
                      <td className="p-3.5 font-bold">{emp?.name} ({pen.empCode})</td>
                      <td className="p-3.5">{pen.date}</td>
                      <td className="p-3.5 font-bold text-rose-700">{pen.type}</td>
                      <td className="p-3.5 font-bold font-mono">{pen.days} يوم</td>
                      <td className="p-3.5 font-bold font-mono text-rose-600">-{pen.amount.toLocaleString()} ج.م</td>
                      <td className="p-3.5 text-slate-500">{pen.reason}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. النافذة المنبثقة: كشف الحساب الشامل للموظف (Employee 360°)   */}
      {/* ============================================================== */}
      {selectedEmpFor360 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">بطاقة الحساب التحليلي المالي (360°)</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedEmpFor360.name}
                </h2>
                <p className="text-xs text-slate-400">
                  كود: {selectedEmpFor360.code} | {selectedEmpFor360.position} | {selectedEmpFor360.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmpFor360(null)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* الأرقام المالية الحية الخاصة بالموظف فقط */}
            {(() => {
              const summary = payrollSummary.find((p) => p.code === selectedEmpFor360.code);
              const empAtt = attendance.filter((a) => a.empCode === selectedEmpFor360.code);
              const empLoans = loans.filter((l) => l.empCode === selectedEmpFor360.code);
              const empPen = penalties.filter((p) => p.empCode === selectedEmpFor360.code);

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                      <span className="text-[11px] text-slate-400">الراتب الأساسي</span>
                      <p className="text-base font-bold">{selectedEmpFor360.basicSalary.toLocaleString()} ج.م</p>
                      <span className="text-[10px] text-slate-500 font-mono">سعر الساعة: {summary?.hourlyRate.toFixed(2)} ج.م</span>
                    </div>
                    <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 p-3">
                      <span className="text-[11px] text-blue-600 font-bold">إجمالي الساعات الإضافية</span>
                      <p className="text-base font-black text-blue-700">+{summary?.totalOtHours.toFixed(1)} س</p>
                      <span className="text-[10px] text-blue-600 font-mono">بقيمة: +{summary?.totalOtPay.toLocaleString()} ج.م</span>
                    </div>
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/30 p-3">
                      <span className="text-[11px] text-amber-600 font-bold">قسط السلف المستقطع</span>
                      <p className="text-base font-black text-amber-700">-{summary?.monthlyLoanDeduction.toLocaleString()} ج.م</p>
                      <span className="text-[10px] text-amber-600">من إجمالي سلف جارية</span>
                    </div>
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 p-3">
                      <span className="text-[11px] text-emerald-700 font-bold">صافي الراتب المستحق</span>
                      <p className="text-lg font-black text-emerald-800 font-mono">{summary?.netPay.toLocaleString()} ج.م</p>
                      <span className="text-[10px] text-emerald-700">شامل الإضافي والاستقطاع</span>
                    </div>
                  </div>

                  {/* سجل حركات الحضور بالتفصيل للموظف */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      سجل حضور الموظف بالدقيقة وحساب ما فوق الـ 8 ساعات ({empAtt.length} حركات)
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-48">
                      <table className="w-full text-right text-[11px]">
                        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                          <tr>
                            <th className="p-2">التاريخ</th>
                            <th className="p-2">حضور</th>
                            <th className="p-2">انصراف</th>
                            <th className="p-2">إجمالي الوقت</th>
                            <th className="p-2">أساسي</th>
                            <th className="p-2 text-blue-600">إضافي (+فوق 8)</th>
                            <th className="p-2 text-emerald-700">القيمة المستحقة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {empAtt.length === 0 ? (
                            <tr><td colSpan={7} className="p-3 text-center text-slate-400">لا توجد حركات مسجلة</td></tr>
                          ) : (
                            empAtt.map((a) => (
                              <tr key={a.id}>
                                <td className="p-2">{a.date}</td>
                                <td className="p-2 font-mono">{a.timeIn}</td>
                                <td className="p-2 font-mono">{a.timeOut}</td>
                                <td className="p-2 font-bold">{a.totalHours.toFixed(2)} س</td>
                                <td className="p-2 text-slate-400">{a.regularHours.toFixed(2)} س</td>
                                <td className="p-2 font-bold text-blue-600">+{a.overtimeHours.toFixed(2)} س</td>
                                <td className="p-2 font-bold text-emerald-700">{a.overtimePay.toFixed(2)} ج.م</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* السلف والجزاءات القائمة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                      <h4 className="text-xs font-bold text-amber-700 mb-2">السلف القائمة بذمته ({empLoans.length})</h4>
                      {empLoans.length === 0 ? (
                        <p className="text-xs text-slate-400">لا توجد سلف جارية</p>
                      ) : (
                        empLoans.map((l) => (
                          <div key={l.id} className="text-xs border-b border-slate-100 dark:border-slate-800 py-1.5 flex justify-between">
                            <span>سلفة بتاريخ {l.date}</span>
                            <span className="font-bold font-mono text-rose-600">باقي: {l.remainingAmount.toLocaleString()} ج.م (قسط: {l.monthlyInstallment})</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                      <h4 className="text-xs font-bold text-rose-700 mb-2">الجزاءات والخصومات ({empPen.length})</h4>
                      {empPen.length === 0 ? (
                        <p className="text-xs text-slate-400">لا توجد جزاءات مسجلة</p>
                      ) : (
                        empPen.map((p) => (
                          <div key={p.id} className="text-xs border-b border-slate-100 dark:border-slate-800 py-1.5 flex justify-between">
                            <span>{p.type}: {p.reason}</span>
                            <span className="font-bold font-mono text-rose-600">-{p.amount.toLocaleString()} ج.م ({p.days} يوم)</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. نافذة تسجيل الحضور والشيفت الذكية                           */}
      {/* ============================================================== */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">⏱️ تسجيل حضور وانصراف وحساب الإضافي</h3>
            <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">الموظف</label>
                <select
                  value={attForm.empCode}
                  onChange={(e) => setAttForm({ ...attForm, empCode: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold"
                >
                  {employees.map((e) => (
                    <option key={e.code} value={e.code}>{e.name} ({e.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">تاريخ العمل</label>
                <input
                  type="date"
                  value={attForm.date}
                  onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">وقت الحضور</label>
                  <input
                    type="time"
                    value={attForm.timeIn}
                    onChange={(e) => setAttForm({ ...attForm, timeIn: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">وقت الانصراف</label>
                  <input
                    type="time"
                    value={attForm.timeOut}
                    onChange={(e) => setAttForm({ ...attForm, timeOut: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">ملاحظات التشغيل</label>
                <input
                  type="text"
                  placeholder="سبب الساعات الإضافية إن وجد..."
                  value={attForm.notes}
                  onChange={(e) => setAttForm({ ...attForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-bold text-white shadow-xs">
                  حفظ واحتساب الإضافي
                </button>
                <button type="button" onClick={() => setIsAttendanceModalOpen(false)} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 font-bold text-slate-600">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. نافذة صرف سلفة جديدة                                        */}
      {/* ============================================================== */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">💵 صرف سلفة وقيد قسط شهري</h3>
            <form onSubmit={handleSaveLoan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">الموظف المستلف</label>
                <select
                  value={loanForm.empCode}
                  onChange={(e) => setLoanForm({ ...loanForm, empCode: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold"
                >
                  {employees.map((e) => (
                    <option key={e.code} value={e.code}>{e.name} ({e.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">مبلغ السلفة الإجمالي (ج.م)</label>
                <input
                  type="number"
                  min="100"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({ ...loanForm, amount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">قيمة القسط الشهري المستقطع (ج.م)</label>
                <input
                  type="number"
                  min="50"
                  value={loanForm.installment}
                  onChange={(e) => setLoanForm({ ...loanForm, installment: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold font-mono text-amber-600"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 rounded-xl bg-amber-600 hover:bg-amber-700 py-3 font-bold text-white shadow-xs">
                  اعتماد السلفة والقيد
                </button>
                <button type="button" onClick={() => setIsLoanModalOpen(false)} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 font-bold text-slate-600">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. نافذة تسجيل جزاء مالي / غياب                                */}
      {/* ============================================================== */}
      {isPenaltyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">⚠️ تسجيل جزاء مالي أو استقطاع غياب</h3>
            <form onSubmit={handleSavePenalty} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">الموظف</label>
                <select
                  value={penForm.empCode}
                  onChange={(e) => setPenForm({ ...penForm, empCode: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold"
                >
                  {employees.map((e) => (
                    <option key={e.code} value={e.code}>{e.name} ({e.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">نوع الاستقطاع</label>
                  <select
                    value={penForm.type}
                    onChange={(e) => setPenForm({ ...penForm, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold"
                  >
                    <option value="غياب">غياب</option>
                    <option value="تأخير">تأخير</option>
                    <option value="مخالفة تشغيل">مخالفة تشغيل</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">المدة (أيام)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={penForm.days}
                    onChange={(e) => setPenForm({ ...penForm, days: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 font-bold font-mono text-rose-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">سبب الاستقطاع / بيان المخالفة</label>
                <input
                  type="text"
                  placeholder="سبب الجزاء المعتمد..."
                  value={penForm.reason}
                  onChange={(e) => setPenForm({ ...penForm, reason: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 font-bold text-white shadow-xs">
                  ترحيل الخصم للراتب
                </button>
                <button type="button" onClick={() => setIsPenaltyModalOpen(false)} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 font-bold text-slate-600">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
