import { ExecutiveKpis } from '@/components/dashboard/ExecutiveKpis';
import { PayrollTable } from '@/components/tables/PayrollTable';
import { DashboardMetrics } from '@/types/dashboard';

// بيانات تجريبية مطابقة تماماً لشيتات إكسيل الخاصة بالشركة (Jan / Feb 2026)
const sampleMetrics: DashboardMetrics = {
  totalPayrollNet: 86416.66,
  totalFactoryLaborCost: 2056289.0, // مجموع عمالة سيدات وعمالة رجال المصنع
  totalContractorCost: 367964.0,   // مستخلصات أبو عاصم وإسلام الأزلي
  totalOvertimeHours: 41.0,
  totalLeaveDaysTaken: 91.0,
  totalLoanDeductions: 1000.0,
  estimatedOperationalProfit: 3450000.0,
};

const samplePayrollRows = [
  { code: 'E001', name: 'مصطفى فريج فؤاد', basicSalary: 0, dailyRate: 0.00, absenceDeduction: 0.00, overtimePay: 0.00, bonuses: 1500.00, grossPay: 1500.00, loanInstallment: 0.00, penalties: 0.00, netPay: 1500.00 },
  { code: 'E002', name: 'أحمد سعد أحمد إبراهيم', basicSalary: 35000, dailyRate: 1166.67, absenceDeduction: 1166.67, overtimePay: 0.00, bonuses: 700.00, grossPay: 34533.33, loanInstallment: 1000.00, penalties: 0.00, netPay: 33533.33 },
  { code: 'E003', name: 'عمرو محمود محمد علي', basicSalary: 25000, dailyRate: 833.33, absenceDeduction: 0.00, overtimePay: 0.00, bonuses: 2500.00, grossPay: 27500.00, loanInstallment: 0.00, penalties: 0.00, netPay: 27500.00 },
  { code: 'E004', name: 'محمود برسي محمود برسي', basicSalary: 11000, dailyRate: 366.67, absenceDeduction: 0.00, overtimePay: 0.00, bonuses: 300.00, grossPay: 11300.00, loanInstallment: 0.00, penalties: 0.00, netPay: 11300.00 },
  { code: 'E005', name: 'أحمد عاطف أحمد محمدين', basicSalary: 11000, dailyRate: 366.67, absenceDeduction: 733.34, overtimePay: 0.00, bonuses: 800.00, grossPay: 11066.66, loanInstallment: 0.00, penalties: 150.00, netPay: 10916.66 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <ExecutiveKpis metrics={sampleMetrics} />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            كشف مسير الرواتب المباشر (الشهر الحالي)
          </h2>
          <span className="text-xs text-slate-500">حساب آلي لحظي معتمد على الحضور والسلف</span>
        </div>
        <PayrollTable rows={samplePayrollRows} />
      </div>
    </div>
  );
}
