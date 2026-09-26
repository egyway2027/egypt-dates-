import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'negative';
  variant?: 'emerald' | 'slate' | 'amber';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendType = 'neutral',
  variant = 'slate',
}) => {
  const borderStyles = {
    emerald: 'border-r-4 border-r-emerald-800',
    slate: 'border-r-4 border-r-slate-700',
    amber: 'border-r-4 border-r-amber-600',
  };

  const trendStyles = {
    positive: 'text-emerald-700 bg-emerald-50',
    neutral: 'text-slate-600 bg-slate-50',
    negative: 'text-rose-700 bg-rose-50',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${borderStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        {trend && (
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${trendStyles[trendType]}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>
    </div>
  );
};
