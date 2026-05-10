import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-6">
        <Inbox size={32} className="text-surface-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-surface-500 max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  )
}
