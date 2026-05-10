import { useState } from 'react'
import { CheckSquare, StickyNote, CalendarDays, X } from 'lucide-react'
import Modal from './Modal'
import { useStore } from '../store/useStore'
import { PRIORITIES, CATEGORIES, generateId } from '../utils/helpers'

export default function QuickAddModal() {
  const { closeModal, addTask, addNote, addEvent } = useStore()
  const [tab, setTab] = useState('task')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target
    
    setTimeout(() => {
      if (tab === 'task') {
        addTask({
          title: form.title.value,
          description: form.description.value,
          priority: form.priority.value,
          category: form.category.value,
          status: 'todo',
          dueDate: form.dueDate.value,
          tags: [],
        })
      } else if (tab === 'note') {
        addNote({
          title: form.title.value,
          content: form.content.value,
          folder: 'Quick Notes',
          tags: [],
          pinned: false,
        })
      } else if (tab === 'event') {
        addEvent({
          title: form.title.value,
          date: form.date.value,
          time: form.time.value,
          duration: parseInt(form.duration.value),
          category: form.category.value,
          color: 'bg-primary-500',
        })
      }
      setLoading(false)
      closeModal('quickAdd')
    }, 400)
  }

  const tabs = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'note', label: 'Note', icon: StickyNote },
    { id: 'event', label: 'Event', icon: CalendarDays },
  ]

  return (
    <Modal name="quickAdd" title="Quick Add" maxWidth="max-w-md">
      <div className="flex gap-2 mb-6 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600 dark:text-primary-400'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input name="title" required className="input-field" placeholder={`${tab === 'task' ? 'What needs to be done?' : tab === 'note' ? 'Note title' : 'Event name'}`} />
        </div>

        {tab === 'task' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea name="description" rows={2} className="input-field resize-none" placeholder="Add details..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Priority</label>
                <select name="priority" className="input-field">
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select name="category" className="input-field">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date</label>
              <input name="dueDate" type="date" required className="input-field" />
            </div>
          </>
        )}

        {tab === 'note' && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Content</label>
            <textarea name="content" rows={4} className="input-field resize-none" placeholder="Start writing..." />
          </div>
        )}

        {tab === 'event' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Date</label>
                <input name="date" type="date" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Time</label>
                <input name="time" type="time" required className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Duration (min)</label>
                <input name="duration" type="number" defaultValue={60} min={15} step={15} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select name="category" className="input-field">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => closeModal('quickAdd')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
