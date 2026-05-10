import { Search, Moon, Sun, Bell, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useTheme } from '../hooks/useTheme'
import { formatDate } from '../utils/helpers'

export default function Header() {
  const { sidebarOpen, setSearchQuery, theme, setTheme, openModal } = useStore()
  useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')
  }

  return (
    <header
      className="fixed top-0 right-0 h-16 z-30 glass border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-6 transition-all duration-300"
      style={{ left: sidebarOpen ? 260 : 80 }}
    >
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            id="global-search"
            type="text"
            placeholder="Search tasks, notes, events... (⌘K)"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:block text-sm text-surface-500">{formatDate(new Date())}</span>
        
        <button
          onClick={() => openModal('quickAdd')}
          className="p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all hover:scale-105 active:scale-95"
          aria-label="Quick add"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-800 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        <button className="relative p-2.5 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-800 transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
          JD
        </div>
      </div>
    </header>
  )
}
