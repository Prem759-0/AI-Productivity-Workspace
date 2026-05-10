import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, Target } from 'lucide-react'
import { useStore } from '../store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Analytics() {
  const { tasks, weeklyData, focusSessions } = useStore()

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100) : 0
  const avgFocusTime = focusSessions.length > 0
    ? Math.round(focusSessions.reduce((acc, s) => acc + s.duration, 0) / focusSessions.length)
    : 0

  const radarData = [
    { subject: 'Work', A: 85, fullMark: 100 },
    { subject: 'Personal', A: 65, fullMark: 100 },
    { subject: 'Learning', A: 70, fullMark: 100 },
    { subject: 'Health', A: 55, fullMark: 100 },
    { subject: 'Finance', A: 45, fullMark: 100 },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-surface-500 mt-1">Track your productivity patterns</p>
      </div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Tasks', value: tasks.length, icon: Target, color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { label: 'Focus Sessions', value: focusSessions.length, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Avg Focus', value: `${avgFocusTime}m`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-surface-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <h3 className="text-lg font-semibold mb-6">Tasks vs Completed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-200 dark:text-surface-800" vertical={false} />
              <XAxis dataKey="day" stroke="currentColor" className="text-surface-400" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-surface-400" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tw-bg-opacity)',
                  borderRadius: '12px',
                  border: '1px solid var(--tw-border-opacity)',
                }}
              />
              <Bar dataKey="tasks" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <h3 className="text-lg font-semibold mb-6">Focus Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-200 dark:text-surface-800" vertical={false} />
              <XAxis dataKey="day" stroke="currentColor" className="text-surface-400" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-surface-400" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tw-bg-opacity)',
                  borderRadius: '12px',
                  border: '1px solid var(--tw-border-opacity)',
                }}
              />
              <Line type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div variants={item} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 max-w-lg mx-auto">
        <h3 className="text-lg font-semibold mb-6 text-center">Category Balance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="currentColor" className="text-surface-200 dark:text-surface-800" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-surface-500" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Productivity" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
