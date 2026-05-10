import { motion } from 'framer-motion'
import { CheckSquare, Clock, TrendingUp, Zap, ArrowRight, Calendar } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatDate, formatTime } from '../utils/helpers'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { tasks, events, notes, weeklyData, categoryData } = useStore()

  const pendingTasks = tasks.filter((t) => t.status !== 'done').length
  const completedToday = tasks.filter((t) => t.status === 'done').length
  const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length
  const totalNotes = notes.length

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  const recentTasks = tasks.slice(0, 5)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Good evening, John</h1>
          <p className="text-primary-100 text-lg">You have {pendingTasks} pending tasks and {upcomingEvents.length} events today.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Tasks', value: pendingTasks, icon: CheckSquare, color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { label: "Today's Done", value: completedToday, icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'High Priority', value: highPriority, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Total Notes', value: totalNotes, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-surface-500">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <motion.div variants={item} className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Weekly Productivity</h3>
            <Link to="/analytics" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-200 dark:text-surface-800" vertical={false} />
              <XAxis dataKey="day" stroke="currentColor" className="text-surface-400" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-surface-400" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tw-bg-opacity)',
                  borderRadius: '12px',
                  border: '1px solid var(--tw-border-opacity)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Area type="monotone" dataKey="focus" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={item} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <h3 className="text-lg font-semibold mb-6">Task Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-surface-600 dark:text-surface-400">{cat.name}</span>
                </div>
                <span className="font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div variants={item} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Tasks</h3>
            <Link to="/tasks" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${task.status === 'done' ? 'line-through text-surface-400' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-surface-500">{task.category}</p>
                </div>
                <span className="text-xs text-surface-400 shrink-0">{formatDate(task.dueDate)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={item} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Link to="/calendar" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Calendar <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${event.color} bg-opacity-20 flex flex-col items-center justify-center text-white shrink-0`}>
                  <Calendar size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  <p className="text-sm text-surface-500">{formatDate(event.date)} at {event.time}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 shrink-0">
                  {event.duration}m
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
