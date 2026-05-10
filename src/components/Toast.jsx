import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  error: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  info: 'bg-primary-500/10 text-primary-600 border-primary-500/20',
}

export default function Toast() {
  const { toasts } = useStore()

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-xl ${colors[toast.type]}`}
            >
              <Icon size={20} />
              <p className="text-sm font-medium pr-4">{toast.message}</p>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
