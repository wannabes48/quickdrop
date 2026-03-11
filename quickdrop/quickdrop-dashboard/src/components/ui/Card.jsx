import { cn } from '../../lib/utils';

export function Card({ children, className, header, noPad }) {
  return (
    <div className={cn(
      'bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700',
      'shadow-[0_1px_3px_0_rgb(0_0_0/0.06)] dark:shadow-none',
      !noPad && 'p-5',
      className
    )}>
      {header && (
        <div className="flex items-center justify-between mb-4">
          {typeof header === 'string'
            ? <h3 className="font-semibold text-slate-800 dark:text-slate-100">{header}</h3>
            : header}
        </div>
      )}
      {children}
    </div>
  );
}
