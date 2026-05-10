import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-2xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 space-y-4"
    >
      <div className="h-4 w-1/3 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
      <div className="h-3 w-3/4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
      <div className="h-3 w-1/2 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-surface-200 dark:bg-surface-700 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-surface-200 dark:bg-surface-700 rounded-full animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonStat() {
  return (
    <div className="p-6 rounded-2xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 space-y-3">
      <div className="h-8 w-16 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
      <div className="h-4 w-24 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
    </div>
  )
}
