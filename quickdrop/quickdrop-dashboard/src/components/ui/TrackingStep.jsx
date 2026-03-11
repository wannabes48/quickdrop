import { motion } from 'framer-motion';
import { Check, Package, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const stepIcons = {
  PENDING:    Package,
  ASSIGNED:   Truck,
  PICKED_UP:  MapPin,
  IN_TRANSIT: Truck,
  DELIVERED:  CheckCircle2,
};

export function TrackingStep({ steps = [] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const Icon = stepIcons[step.key] || Package;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors',
                  step.is_complete
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : step.is_current
                    ? 'border-rose-500 bg-white dark:bg-slate-800 text-rose-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400'
                )}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                {step.is_complete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </motion.div>
              {!isLast && (
                <div className="w-0.5 flex-1 my-1 min-h-[2rem]">
                  <motion.div
                    className="w-full h-full bg-rose-500 origin-top rounded-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: step.is_complete ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  />
                  <div className={cn(
                    'w-full h-full -mt-full rounded-full',
                    'bg-slate-200 dark:bg-slate-700',
                    step.is_complete && 'opacity-0'
                  )} style={{ marginTop: step.is_complete ? '-100%' : 0 }} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-5', isLast && 'pb-0')}>
              <p className={cn(
                'font-semibold text-sm',
                step.is_complete || step.is_current ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
              )}>
                {step.label}
              </p>
              {step.is_current && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-rose-500 font-medium"
                >
                  Current stage
                </motion.span>
              )}
              {step.is_complete && (
                <p className="text-xs text-slate-400 dark:text-slate-500">Completed</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
