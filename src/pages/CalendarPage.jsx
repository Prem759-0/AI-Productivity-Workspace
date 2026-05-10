import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns'
import { cn } from '../utils/helpers'
import EmptyState from '../components/EmptyState'

export default function CalendarPage() {
  const { events, deleteEvent, openModal } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)

  const selectedEvents = events.filter((e) => isSameDay(new Date(e.date), selectedDate)).sort((a, b) => a.time.localeCompare(b.time))

  const getEventsForDay = (day) => events.filter((e) => isSameDay(new Date(e.date), day))

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-surface-500 mt-1">Plan your schedule</p>
        </div>
        <button onClick={() => openModal('quickAdd')} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-surface-500 py-2">
                {day}
              </div>
            ))}
            
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {days.map((day) => {
              const dayEvents = getEventsForDay(day)
              const isSelected = isSameDay(day, selectedDate)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())

              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-start pt-2 transition-all relative',
                    isSelected
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : isToday
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800',
                    !isCurrentMonth && 'opacity-30'
                  )}
                >
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((e, i) => (
                        <div key={i} className={cn('w-1.5 h-1.5 rounded-full', isSelected ? 'bg-white/70' : e.color)} />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className={cn('text-[8px]', isSelected ? 'text-white/70' : 'text-surface-400')}>+</span>
                      )}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Day Detail */}
        <div className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <h3 className="text-lg font-semibold mb-1">{format(selectedDate, 'EEEE, MMMM d')}</h3>
          <p className="text-sm text-surface-500 mb-6">{selectedEvents.length} events</p>

          {selectedEvents.length === 0 ? (
            <EmptyState
              title="No events"
              description="No events scheduled for this day."
              action={<button onClick={() => openModal('quickAdd')} className="btn-secondary text-sm">Add Event</button>}
            />
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 group"
                >
                  <div className={cn('w-1 h-12 rounded-full shrink-0', event.color)} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-surface-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {event.time}
                      </span>
                      <span>{event.duration}m</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-surface-400 hover:text-rose-500 transition-all"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
