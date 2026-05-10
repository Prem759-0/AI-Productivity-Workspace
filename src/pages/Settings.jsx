import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Keyboard, Trash2, AlertTriangle, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn } from '../utils/helpers'

export default function Settings() {
  const { theme, setTheme, tasks, notes, events, focusSessions, addToast } = useStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearData = () => {
    localStorage.removeItem('zenith-storage')
    window.location.reload()
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-surface-500 mt-1">Customize your workspace</p>
      </div>

      {/* Appearance */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-6">
        <h2 className="text-lg font-semibold">Appearance</h2>
        
        <div>
          <label className="block text-sm font-medium mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  theme === t.value
                    ? 'border-primary-500 bg-primary-500/5'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                )}
              >
                <t.icon size={24} className={theme === t.value ? 'text-primary-500' : 'text-surface-400'} />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-6">
        <div className="flex items-center gap-3">
          <Keyboard size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
        </div>
        
        <div className="space-y-3">
          {[
            { keys: '⌘1-7', action: 'Navigate pages' },
            { keys: '⌘K', action: 'Focus search' },
            { keys: '⌘T', action: 'New task' },
            { keys: '⌘N', action: 'New note' },
            { keys: '?', action: 'Show shortcuts help' },
          ].map((shortcut) => (
            <div key={shortcut.action} className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
              <span className="text-sm text-surface-600 dark:text-surface-400">{shortcut.action}</span>
              <kbd className="px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-mono font-medium">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-6">
        <h2 className="text-lg font-semibold">Data</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Tasks</p>
              <p className="text-sm text-surface-500">{tasks.length} items</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Notes</p>
              <p className="text-sm text-surface-500">{notes.length} items</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Events</p>
              <p className="text-sm text-surface-500">{events.length} items</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Focus Sessions</p>
              <p className="text-sm text-surface-500">{focusSessions.length} sessions</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-200 dark:border-surface-800">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              <Trash2 size={18} /> Clear All Data
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle size={18} />
                <span className="font-medium">This cannot be undone</span>
              </div>
              <p className="text-sm text-rose-600/80 dark:text-rose-400/80">
                All your tasks, notes, events, and settings will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleClearData} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors">
                  Yes, Clear Everything
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
        <h2 className="text-lg font-semibold mb-2">About Zenith</h2>
        <p className="text-sm text-surface-500">Version 1.0.0 — Built with React, Tailwind CSS, and Framer Motion.</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-surface-500">All systems operational</span>
        </div>
      </section>
    </div>
  )
}
