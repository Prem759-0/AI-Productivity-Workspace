import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn } from '../utils/helpers'

const MODES = {
  work: { label: 'Focus', minutes: 25, color: 'from-primary-500 to-primary-600', icon: Brain },
  shortBreak: { label: 'Short Break', minutes: 5, color: 'from-emerald-500 to-emerald-600', icon: Coffee },
  longBreak: { label: 'Long Break', minutes: 15, color: 'from-purple-500 to-purple-600', icon: Coffee },
}

export default function Focus() {
  const { focusSettings, updateFocusSettings, addFocusSession } = useStore()
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(focusSettings.work * 60)
  const [isActive, setIsActive] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef(null)

  const currentMode = MODES[mode]
  const totalTime = focusSettings[mode] * 60
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  useEffect(() => {
    setTimeLeft(focusSettings[mode] * 60)
    setIsActive(false)
  }, [mode, focusSettings])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      clearInterval(intervalRef.current)
      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1)
        addFocusSession({ duration: focusSettings.work, date: new Date().toISOString() })
        if (soundEnabled) playNotificationSound()
      }
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, timeLeft, mode, focusSettings, soundEnabled])

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu8LdnHgU2kNbxz4AzBhxqv+zplkcODVGm5O+4ZSAEMYrO89GFNwYdcfDr4ZdJDQtPp+XysWUeBjiS1/LNfi0GI33R8tOENAcdcO/r4phJDQxPqOXyxGUhBjqT1/PQfS4GI3/R8tSFNwYdcfDr4plHDAtQp+TwxmUgBDeOzvPVhjYGHG3A7+SaSQ0MTKjl8sZmIAU2jc7z1YU1Bhxwv+zmm0gNC1Gn5O/EZSAFNo/M89CEMwYccPDs4ppIDQtRp+TvvWUfBTiOz/PShjUGG3Dw7OKbSA0LUqjl8b1kHwU3jM/z0oU1Bxtw8OzhmUgNC1Ko5fG+ZSAF')
    audio.play().catch(() => {})
  }

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(focusSettings[mode] * 60)
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Focus Timer</h1>
        <p className="text-surface-500 mt-1">Stay in the zone</p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-2 p-1 bg-surface-100 dark:bg-surface-800 rounded-2xl max-w-md mx-auto">
        {Object.entries(MODES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all',
              mode === key
                ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            )}
          >
            <config.icon size={16} />
            {config.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative flex items-center justify-center py-8">
        <svg className="transform -rotate-90 w-80 h-80">
          <circle cx="160" cy="160" r="120" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface-200 dark:text-surface-800" />
          <motion.circle
            cx="160"
            cy="160"
            r="120"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={timeLeft}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-bold tabular-nums tracking-tight"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <p className="text-surface-500 mt-2 font-medium">{isActive ? 'Focusing...' : 'Ready to start'}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-4 rounded-2xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={cn(
            'p-6 rounded-3xl text-white shadow-xl transition-all',
            isActive ? 'bg-amber-500 shadow-amber-500/25' : 'bg-gradient-to-r from-primary-500 to-purple-600 shadow-primary-500/25'
          )}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </motion.button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-2xl font-bold">{completedSessions}</div>
          <div className="text-xs text-surface-500 mt-1">Sessions</div>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-2xl font-bold">{Math.round((completedSessions * focusSettings.work) / 60 * 10) / 10}h</div>
          <div className="text-xs text-surface-500 mt-1">Focused</div>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="text-2xl font-bold">{focusSettings.work}</div>
          <div className="text-xs text-surface-500 mt-1">Min/Session</div>
        </div>
      </div>
    </div>
  )
}
