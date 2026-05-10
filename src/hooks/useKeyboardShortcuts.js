import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const { addToast, openModal } = useStore()

  useEffect(() => {
    const handler = (e) => {
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            document.getElementById('global-search')?.focus()
            break
          case 't':
            e.preventDefault()
            openModal('task')
            break
          case 'n':
            e.preventDefault()
            openModal('note')
            break
          case '1':
            e.preventDefault()
            navigate('/')
            break
          case '2':
            e.preventDefault()
            navigate('/tasks')
            break
          case '3':
            e.preventDefault()
            navigate('/kanban')
            break
          case '4':
            e.preventDefault()
            navigate('/calendar')
            break
          case '5':
            e.preventDefault()
            navigate('/notes')
            break
          case '6':
            e.preventDefault()
            navigate('/focus')
            break
          case '7':
            e.preventDefault()
            navigate('/analytics')
            break
        }
      }

      if (e.key === '?') {
        e.preventDefault()
        addToast({
          message: 'Shortcuts: ⌘1-7 Navigate | ⌘K Search | ⌘T New Task | ⌘N New Note | ? Help',
          type: 'info',
          duration: 6000,
        })
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, openModal, addToast])
}
