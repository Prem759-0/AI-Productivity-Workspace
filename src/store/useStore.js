import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { demoTasks, demoNotes, demoEvents, weeklyData, categoryData } from '../utils/demoData'
import { generateId } from '../utils/helpers'

export const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toasts: [],
      addToast: (toast) => {
        const id = generateId()
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, toast.duration || 4000)
      },
      modals: {},
      openModal: (name, data = null) => set((state) => ({ modals: { ...state.modals, [name]: { open: true, data } } })),
      closeModal: (name) => set((state) => ({ modals: { ...state.modals, [name]: { open: false, data: null } } })),

      // Tasks
      tasks: demoTasks,
      addTask: (task) => {
        const newTask = { ...task, id: generateId(), createdAt: new Date().toISOString() }
        set((state) => ({ tasks: [newTask, ...state.tasks] }))
        get().addToast({ message: 'Task created successfully', type: 'success' })
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
        }))
      },
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
        get().addToast({ message: 'Task deleted', type: 'info' })
      },
      moveTask: (taskId, newStatus) => {
        get().updateTask(taskId, { status: newStatus })
      },

      // Notes
      notes: demoNotes,
      addNote: (note) => {
        const newNote = { ...note, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        set((state) => ({ notes: [newNote, ...state.notes] }))
        get().addToast({ message: 'Note saved', type: 'success' })
      },
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)),
        }))
      },
      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
        get().addToast({ message: 'Note deleted', type: 'info' })
      },

      // Calendar Events
      events: demoEvents,
      addEvent: (event) => {
        const newEvent = { ...event, id: generateId() }
        set((state) => ({ events: [...state.events, newEvent] }))
        get().addToast({ message: 'Event added', type: 'success' })
      },
      deleteEvent: (id) => {
        set((state) => ({ events: state.events.filter((e) => e.id !== id) }))
      },

      // Focus Timer
      focusSettings: { work: 25, shortBreak: 5, longBreak: 15, autoStart: false },
      updateFocusSettings: (settings) => set((state) => ({ focusSettings: { ...state.focusSettings, ...settings } })),
      focusSessions: [],
      addFocusSession: (session) => set((state) => ({ focusSessions: [session, ...state.focusSessions] })),

      // Analytics (simulated)
      weeklyData,
      categoryData,

      // Search & Filter
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      filterCategory: 'all',
      setFilterCategory: (cat) => set({ filterCategory: cat }),
      filterPriority: 'all',
      setFilterPriority: (pri) => set({ filterPriority: pri }),
      filterStatus: 'all',
      setFilterStatus: (status) => set({ filterStatus: status }),
    }),
    {
      name: 'zenith-storage',
      partialize: (state) => ({
        theme: state.theme,
        tasks: state.tasks,
        notes: state.notes,
        events: state.events,
        focusSettings: state.focusSettings,
        focusSessions: state.focusSessions,
      }),
    }
  )
)
