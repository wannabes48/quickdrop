import { cn } from '../../lib/utils';

const statusMap = {
  PENDING:    { label: 'Pending',     class: 'bg-amber-50  text-amber-600  dark:bg-amber-900/30  dark:text-amber-400'  },
  ASSIGNED:   { label: 'Assigned',    class: 'bg-blue-50   text-blue-600   dark:bg-blue-900/30   dark:text-blue-400'   },
  PICKED_UP:  { label: 'Picked Up',   class: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  IN_TRANSIT: { label: 'In Transit',  class: 'bg-teal-50   text-teal-600   dark:bg-teal-900/30   dark:text-teal-400'   },
  DELIVERED:  { label: 'Delivered',   class: 'bg-green-50  text-green-600  dark:bg-green-900/30  dark:text-green-400'  },
  CANCELLED:  { label: 'Cancelled',   class: 'bg-red-50    text-red-500    dark:bg-red-900/30    dark:text-red-400'    },
  PAID:       { label: 'Paid',        class: 'bg-green-50  text-green-600  dark:bg-green-900/30  dark:text-green-400'  },
  FAILED:     { label: 'Failed',      class: 'bg-red-50    text-red-500    dark:bg-red-900/30    dark:text-red-400'    },
};

export function Badge({ status, label: customLabel, className }) {
  const config = statusMap[status] || { label: status, class: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' };
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
      config.class,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {customLabel ?? config.label}
    </span>
  );
}
