import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, GripVertical } from 'lucide-react'
import { useStore } from '../store/useStore'
import { STATUSES, PRIORITIES, cn } from '../utils/helpers'
import EmptyState from '../components/EmptyState'

export default function Kanban() {
  const { tasks, moveTask, updateTask, openModal } = useStore()
  const [draggedTask, setDraggedTask] = useState(null)

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== status) {
      moveTask(draggedTask.id, status)
    }
    setDraggedTask(null)
  }

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status)

  const columnColors = {
    'todo': 'border-surface-300 dark:border-surface-700',
    'in-progress': 'border-primary-500/50',
    'review': 'border-amber-500/50',
    'done': 'border-emerald-500/50',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-surface-500 mt-1">Drag and drop to organize</p>
        </div>
        <button onClick={() => openModal('quickAdd')} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATUSES.map((status) => {
          const columnTasks = getTasksByStatus(status.value)
          
          return (
            <div
              key={status.value}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.value)}
              className={cn(
                'flex flex-col rounded-2xl bg-surface-100/50 dark:bg-surface-900/50 border-2 border-dashed min-h-[500px] p-4 transition-colors',
                columnColors[status.value],
                draggedTask && 'border-primary-500/30 bg-primary-500/5'
              )}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{status.label}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-surface-200 dark:bg-surface-800 text-xs font-medium">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {columnTasks.map((task) => {
                  const priority = PRIORITIES.find((p) => p.value === task.priority)
                  
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, rotate: 2, opacity: 0.9 }}
                      className="group p-4 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <GripVertical size={16} className="text-surface-300 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
                      </div>
                      <p className="text-xs text-surface-500 mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={cn('w-2 h-2 rounded-full', priority?.color)} />
                        <span className="text-xs text-surface-400 capitalize">{task.category}</span>
                      </div>
                    </motion.div>
                  )
                })}
                
                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-xl">
                    <p className="text-sm text-surface-400">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
