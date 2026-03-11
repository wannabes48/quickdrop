import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { Button } from './Button';

/**
 * PaymentOverlay — shows a "Waiting for M-Pesa payment" overlay.
 * Polls `GET /api/deliveries/{deliveryId}/payment_status/` every 3 seconds.
 * Auto-dismisses when payment_status === 'PAID'.
 */
export function PaymentOverlay({ open, deliveryId, onSuccess, onCancel }) {
  const intervalRef = useRef(null);

  const poll = useCallback(async () => {
    if (!deliveryId) return;
    try {
      const res = await fetch(`/api/deliveries/${deliveryId}/payment_status/`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.payment_status === 'PAID') {
        clearInterval(intervalRef.current);
        onSuccess?.();
      }
    } catch (_) { /* network errors are silently ignored */ }
  }, [deliveryId, onSuccess]);

  useEffect(() => {
    if (!open) return;
    intervalRef.current = setInterval(poll, 3000);
    return () => clearInterval(intervalRef.current);
  }, [open, poll]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div
            className="relative flex flex-col items-center gap-6 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Animated M-Pesa logo area */}
            <motion.div
              className="relative w-20 h-20 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 rounded-full bg-rose-100 dark:bg-rose-900/40 animate-ping opacity-30" />
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/50 border-2 border-rose-200 dark:border-rose-800">
                <Smartphone className="w-9 h-9 text-rose-500" />
              </div>
            </motion.div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                Waiting for Payment
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                An M-Pesa STK Push has been sent to your phone. Please approve the payment request.
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-rose-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
              Cancel payment
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
