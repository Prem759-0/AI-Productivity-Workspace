import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpDown, CheckCircle2, Circle, Clock, Tag, Trash2, Edit3 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PRIORITIES, CATEGORIES, STATUSES, cn } from '../utils/helpers'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'

export default function Tasks() {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    deleteTask,
    updateTask,
    openModal,
    closeModal,
    modals,
  } = useStore()

  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [editingTask, setEditingTask] = useState(null)

  const filtered = tasks
    .filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory
      const matchesPriority = filterPriority === 'all' || t.priority === filterPriority
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'dueDate') comparison = new Date(a.dueDate) - new Date(b.dueDate)
      if (sortBy === 'priority') comparison = PRIORITIES.findIndex((p) => p.value === b.priority) - PRIORITIES.findIndex((p) => p.value === a.priority)
      if (sortBy === 'title') comparison = a.title.localeCompare(b.title)
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    openModal('editTask')
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    const form = e.target
    updateTask(editingTask.id, {
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value,
      category: form.category.value,
      status: form.status.value,
      dueDate: form.dueDate.value,
    })
    closeModal('editTask')
    setEditingTask(null)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilterCategory('all')
    setFilterPriority('all')
    setFilterStatus('all')
  }

  const hasFilters = searchQuery || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-surface-500 mt-1">Manage and organize your work</p>
        </div>
        <button onClick={() => openModal('quickAdd')} className="btn-primary flex items-center gap-2 self-start">
          <CheckCircle2 size={18} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-primary-500/50 outline-none text-sm"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-primary-500/50 outline-none text-sm"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-primary-500/50 outline-none text-sm"
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-primary-500/50 outline-none text-sm"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <button
          onClick={() => toggleSort('dueDate')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors',
            sortBy === 'dueDate' ? 'bg-primary-500/10 text-primary-600' : 'bg-surface-100 dark:bg-surface-800'
          )}
        >
          <ArrowUpDown size={14} /> Date
        </button>

        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-rose-500 hover:text-rose-600 px-2">
            Clear
          </button>
        )}
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={hasFilters ? "Try adjusting your filters or search query." : "Get started by creating your first task."}
          action={
            hasFilters ? (
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            ) : (
              <button onClick={() => openModal('quickAdd')} className="btn-primary">Create Task</button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => {
              const priority = PRIORITIES.find((p) => p.value === task.priority)
              const isDone = task.status === 'done'
              
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    'group flex items-start gap-4 p-5 rounded-2xl border transition-all',
                    isDone
                      ? 'bg-surface-50 dark:bg-surface-900/50 border-surface-200 dark:border-surface-800 opacity-60'
                      : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5'
                  )}
                >
                  <button
                    onClick={() => updateTask(task.id, { status: isDone ? 'todo' : 'done' })}
                    className="mt-0.5 shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    ) : (
                      <Circle size={22} className="text-surface-400 hover:text-primary-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={cn('font-semibold truncate', isDone && 'line-through text-surface-400')}>
                        {task.title}
                      </h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium text-white shrink-0', priority?.color)}>
                        {priority?.label}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-surface-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="capitalize">{task.category}</span>
                      {task.tags?.map((tag) => (
                        <span key={tag} className="flex items-center gap-1">
                          <Tag size={12} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-primary-500"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-surface-400 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
      <Modal name="editTask" title="Edit Task">
        {editingTask && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input name="title" defaultValue={editingTask.title} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea name="description" defaultValue={editingTask.description} rows={3} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Priority</label>
                <select name="priority" defaultValue={editingTask.priority} className="input-field">
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select name="status" defaultValue={editingTask.status} className="input-field">
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select name="category" defaultValue={editingTask.category} className="input-field">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Due Date</label>
                <input name="dueDate" type="date" defaultValue={editingTask.dueDate?.split('T')[0]} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => closeModal('editTask')} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
