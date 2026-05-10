import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pin, Search, Trash2, Clock, Folder } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatDate, cn } from '../utils/helpers'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote, openModal, closeModal, modals } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [viewNote, setViewNote] = useState(null)

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinned = filtered.filter((n) => n.pinned)
  const unpinned = filtered.filter((n) => !n.pinned)

  const handleSave = (e) => {
    e.preventDefault()
    const form = e.target
    const noteData = {
      title: form.title.value,
      content: form.content.value,
      folder: form.folder.value || 'Uncategorized',
      tags: form.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
      pinned: form.pinned.checked,
    }

    if (editingNote) {
      updateNote(editingNote.id, noteData)
    } else {
      addNote(noteData)
    }
    closeModal('noteEditor')
    setEditingNote(null)
  }

  const openEditor = (note = null) => {
    setEditingNote(note)
    openModal('noteEditor')
  }

  const openViewer = (note) => {
    setViewNote(note)
    openModal('noteViewer')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-surface-500 mt-1">Capture ideas and thoughts</p>
        </div>
        <button onClick={() => openEditor()} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} /> New Note
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No notes found"
          description={searchQuery ? "Try a different search term." : "Start writing your first note."}
          action={<button onClick={() => openEditor()} className="btn-primary">Create Note</button>}
        />
      ) : (
        <div className="space-y-8">
          {pinned.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-surface-500 mb-4 flex items-center gap-2">
                <Pin size={14} /> Pinned
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinned.map((note) => (
                  <NoteCard key={note.id} note={note} onClick={() => openViewer(note)} onEdit={() => openEditor(note)} onDelete={() => deleteNote(note.id)} />
                ))}
              </div>
            </div>
          )}

          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && <h3 className="text-sm font-medium text-surface-500 mb-4">Others</h3>}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinned.map((note) => (
                  <NoteCard key={note.id} note={note} onClick={() => openViewer(note)} onEdit={() => openEditor(note)} onDelete={() => deleteNote(note.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      <Modal name="noteEditor" title={editingNote ? 'Edit Note' : 'New Note'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input name="title" defaultValue={editingNote?.title} required className="input-field" placeholder="Note title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Content</label>
            <textarea
              name="content"
              defaultValue={editingNote?.content}
              rows={10}
              className="input-field resize-none font-mono text-sm"
              placeholder="Write your note here... (Markdown supported)"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Folder</label>
              <input name="folder" defaultValue={editingNote?.folder || 'Personal'} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tags (comma separated)</label>
              <input name="tags" defaultValue={editingNote?.tags?.join(', ')} className="input-field" placeholder="work, urgent, idea" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="pinned" type="checkbox" defaultChecked={editingNote?.pinned} className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500" />
            <span className="text-sm">Pin this note</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => closeModal('noteEditor')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Note</button>
          </div>
        </form>
      </Modal>

      {/* Viewer Modal */}
      <Modal name="noteViewer" title={viewNote?.title || 'Note'} maxWidth="max-w-2xl">
        {viewNote && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-surface-500">
              <span className="flex items-center gap-1"><Folder size={14} /> {viewNote.folder}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(viewNote.updatedAt || viewNote.createdAt)}</span>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-surface-700 dark:text-surface-300">
                {viewNote.content}
              </pre>
            </div>
            <div className="flex gap-2 pt-4">
              {viewNote.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function NoteCard({ note, onClick, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-lg hover:shadow-primary-500/5 cursor-pointer transition-all"
    >
      <div onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold line-clamp-1">{note.title}</h3>
          {note.pinned && <Pin size={14} className="text-primary-500 shrink-0" />}
        </div>
        <p className="text-sm text-surface-500 line-clamp-3 mb-4">{note.content}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-surface-400">{note.folder}</span>
          <span className="text-xs text-surface-400">{formatDate(note.updatedAt || note.createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-100 dark:border-surface-800 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onEdit() }} className="text-xs text-primary-500 hover:text-primary-600 font-medium">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="text-xs text-rose-500 hover:text-rose-600 font-medium">Delete</button>
      </div>
    </motion.div>
  )
}
