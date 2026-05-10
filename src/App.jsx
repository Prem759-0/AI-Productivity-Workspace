import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'
import { useTheme } from './hooks/useTheme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Toast from './components/Toast'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import QuickAddModal from './components/QuickAddModal'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Kanban = lazy(() => import('./pages/Kanban'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const Notes = lazy(() => import('./pages/Notes'))
const Focus = lazy(() => import('./pages/Focus'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const { sidebarOpen } = useStore()
  const location = useLocation()
  useTheme()
  useKeyboardShortcuts()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 transition-colors duration-300">
      <CustomCursor />
      <Toast />
      <QuickAddModal />
      
      <Sidebar />
      
      <div
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarOpen ? 260 : 80 }}
      >
        <Header />
        
        <main className="pt-20 px-6 pb-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Dashboard /></Suspense></PageWrapper>} />
              <Route path="/tasks" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Tasks /></Suspense></PageWrapper>} />
              <Route path="/kanban" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Kanban /></Suspense></PageWrapper>} />
              <Route path="/calendar" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><CalendarPage /></Suspense></PageWrapper>} />
              <Route path="/notes" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Notes /></Suspense></PageWrapper>} />
              <Route path="/focus" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Focus /></Suspense></PageWrapper>} />
              <Route path="/analytics" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Analytics /></Suspense></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><Settings /></Suspense></PageWrapper>} />
              <Route path="*" element={<PageWrapper><Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}><NotFound /></Suspense></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
