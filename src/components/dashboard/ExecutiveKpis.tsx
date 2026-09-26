import React from 'react';
import { KpiCard } from './KpiCard';
import { DashboardMetrics } from '@/types/dashboard';

interface Props {
  metrics: DashboardMetrics;
}

export const ExecutiveKpis: React.FC<Props> = ({ metrics }) => {
  const formatEgp = (val: number) =>
    new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          لوحة المتابعة والمخرجات التحليلية
        </h1>
        <p className="text-xs text-slate-500">
          بيانات الإخراج الشاملة وتوزيع الالتزامات المالية للرواتب والعمليات الحالية
        </p>
      </div>

      {/* المؤشرات الرئيسية العلوية */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="صافي مسير الرواتب الثابتة"
          value={formatEgp(metrics.totalPayrollNet)}
          subtitle="مستحق الصرف للموظفين الثابتين بالشيت"
          trend="Jan/Feb 2026"
          trendType="neutral"
          variant="emerald"
        />

        <KpiCard
          title="عمالة المصنع والمياومة"
          value={formatEgp(metrics.totalFactoryLaborCost)}
          subtitle="تكلفة ورديات السيدات والرجال"
          trend="محطة التعبئة"
          trendType="neutral"
          variant="amber"
        />

        <KpiCard
          title="مستخلصات المقاولين"
          value={formatEgp(metrics.totalContractorCost)}
          subtitle="عمليات الفسائل والتكييس بالمزارع"
          trend="صافي بعد الحجز"
          trendType="neutral"
          variant="slate"
        />

        <KpiCard
          title="صافي التدفق المالي الخارج"
          value={formatEgp(metrics.totalPayrollNet + metrics.totalFactoryLaborCost + metrics.totalContractorCost)}
          subtitle="إجمالي التزامات الأجور والتشغيل"
          trend="معتمد للصرف"
          trendType="positive"
          variant="emerald"
        />
      </div>

      {/* مؤشرات الأداء التشغيلي وساعات العمل */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">إجمالي ساعات العمل الإضافي</span>
          <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
            {metrics.totalOvertimeHours} <span className="text-xs font-normal">ساعة معتمدة</span>
          </p>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-400">معامل الساعة: 1.0 (طبقاً للإعدادات)</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">أيام الإجازات المستهلكة</span>
          <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
            {metrics.totalLeaveDaysTaken} <span className="text-xs font-normal">يوم مأخوذ</span>
          </p>
          <span className="text-[10px] text-slate-400">تُخصم دورياً من رصيد نظام الدورات (23/7)</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">أقساط السلف المستردة</span>
          <p className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">
            {formatEgp(metrics.totalLoanDeductions)}
          </p>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-400">تخفض أرصدة الأستاذ لحساب السلف آلياً</span>
        </div>
      </div>
    </div>
  );
};
