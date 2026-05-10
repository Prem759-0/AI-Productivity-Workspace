import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  Columns3,
  CalendarDays,
  StickyNote,
  Timer,
  BarChart3,
  Settings,
  Command,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn } from '../utils/helpers'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘1' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks', shortcut: '⌘2' },
  { path: '/kanban', icon: Columns3, label: 'Kanban', shortcut: '⌘3' },
  { path: '/calendar', icon: CalendarDays, label: 'Calendar', shortcut: '⌘4' },
  { path: '/notes', icon: StickyNote, label: 'Notes', shortcut: '⌘5' },
  { path: '/focus', icon: Timer, label: 'Focus', shortcut: '⌘6' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', shortcut: '⌘7' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 80 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-screen z-40 glass-strong border-r border-surface-200 dark:border-surface-800 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 h-16">
        <motion.div
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shrink-0">
            <Command size={16} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-bold text-lg tracking-tight">Zenith</span>}
        </motion.div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors shrink-0"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn('shrink-0', isActive && 'animate-pulse-slow')} />
                {sidebarOpen && (
                  <>
                    <span className="truncate">{item.label}</span>
                    <span className="ml-auto text-xs text-surface-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.shortcut}
                    </span>
                  </>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-full"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-surface-200 dark:border-surface-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              isActive
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            )
          }
        >
          <Settings size={20} className="shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </NavLink>
      </div>
    </motion.aside>
  )
}
