import { generateId } from './helpers'

export const demoTasks = [
  { id: generateId(), title: 'Review Q4 analytics report', description: 'Analyze user engagement metrics and prepare summary', status: 'in-progress', priority: 'high', category: 'work', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), createdAt: new Date().toISOString(), tags: ['analytics', 'quarterly'] },
  { id: generateId(), title: 'Design system audit', description: 'Review component library for accessibility compliance', status: 'todo', priority: 'medium', category: 'work', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), createdAt: new Date().toISOString(), tags: ['design', 'a11y'] },
  { id: generateId(), title: 'Morning meditation', description: '15-minute mindfulness session', status: 'done', priority: 'low', category: 'health', dueDate: new Date().toISOString(), createdAt: new Date().toISOString(), tags: ['wellness'] },
  { id: generateId(), title: 'Learn Rust fundamentals', description: 'Complete chapter 3 of The Rust Programming Language', status: 'in-progress', priority: 'medium', category: 'learning', dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), createdAt: new Date().toISOString(), tags: ['programming', 'rust'] },
  { id: generateId(), title: 'Grocery shopping', description: 'Buy vegetables, protein, and snacks for the week', status: 'todo', priority: 'low', category: 'personal', dueDate: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString(), tags: ['errands'] },
  { id: generateId(), title: 'Update portfolio website', description: 'Add new case studies and optimize images', status: 'review', priority: 'high', category: 'work', dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), createdAt: new Date().toISOString(), tags: ['portfolio', 'web'] },
  { id: generateId(), title: 'Budget review', description: 'Track monthly expenses and adjust savings goals', status: 'todo', priority: 'medium', category: 'finance', dueDate: new Date(Date.now() + 86400000 * 4).toISOString(), createdAt: new Date().toISOString(), tags: ['money', 'planning'] },
  { id: generateId(), title: 'Team standup prep', description: 'Prepare updates for daily standup meeting', status: 'done', priority: 'high', category: 'work', dueDate: new Date().toISOString(), createdAt: new Date().toISOString(), tags: ['meeting'] },
]

export const demoNotes = [
  { id: generateId(), title: 'Project Phoenix Architecture', content: '## Core Components\n\n- Authentication service (OAuth2 + JWT)\n- Real-time notification engine (WebSockets)\n- GraphQL API gateway\n- Microservices: Users, Billing, Analytics\n\n## Tech Stack\n- Frontend: React + TypeScript + Tailwind\n- Backend: Node.js + PostgreSQL + Redis\n- Infrastructure: Kubernetes + AWS\n\n## Key Decisions\n1. Use event-driven architecture for scalability\n2. Implement CQRS for read/write separation\n3. Adopt domain-driven design principles', folder: 'Work', tags: ['architecture', 'planning'], pinned: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), title: 'Book Notes: Deep Work', content: '## Key Takeaways\n\n- Deep work is the ability to focus without distraction on a cognitively demanding task\n- The 4 disciplines of execution:\n  1. Focus on the wildly important\n  2. Act on lead measures\n  3. Keep a compelling scoreboard\n  4. Create a cadence of accountability\n\n- Ritualize deep work sessions\n- Embrace boredom to strengthen focus muscles\n- Quit social media (or strictly limit usage)', folder: 'Learning', tags: ['productivity', 'books'], pinned: true, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: generateId(), title: 'Weekly Meal Plan', content: '- Monday: Grilled salmon + quinoa salad\n- Tuesday: Chicken stir-fry + brown rice\n- Wednesday: Lentil soup + sourdough\n- Thursday: Beef tacos + guacamole\n- Friday: Pasta primavera\n- Saturday: Homemade pizza night\n- Sunday: Meal prep for next week', folder: 'Personal', tags: ['health', 'planning'], pinned: false, createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), updatedAt: new Date().toISOString() },
]

export const demoEvents = [
  { id: generateId(), title: 'Design Review', date: new Date().toISOString(), time: '10:00', duration: 60, category: 'work', color: 'bg-primary-500' },
  { id: generateId(), title: 'Lunch with Sarah', date: new Date(Date.now() + 86400000).toISOString(), time: '12:30', duration: 90, category: 'personal', color: 'bg-emerald-500' },
  { id: generateId(), title: 'Sprint Planning', date: new Date(Date.now() + 86400000 * 2).toISOString(), time: '09:00', duration: 120, category: 'work', color: 'bg-primary-500' },
  { id: generateId(), title: 'Gym Session', date: new Date(Date.now() + 86400000).toISOString(), time: '18:00', duration: 60, category: 'health', color: 'bg-rose-500' },
  { id: generateId(), title: 'Code Review', date: new Date().toISOString(), time: '14:00', duration: 45, category: 'work', color: 'bg-primary-500' },
]

export const weeklyData = [
  { day: 'Mon', tasks: 12, focus: 4.2, completed: 8 },
  { day: 'Tue', tasks: 15, focus: 5.1, completed: 12 },
  { day: 'Wed', tasks: 10, focus: 3.8, completed: 7 },
  { day: 'Thu', tasks: 18, focus: 6.2, completed: 15 },
  { day: 'Fri', tasks: 14, focus: 4.5, completed: 11 },
  { day: 'Sat', tasks: 6, focus: 2.1, completed: 5 },
  { day: 'Sun', tasks: 4, focus: 1.5, completed: 3 },
]

export const categoryData = [
  { name: 'Work', value: 45, color: '#0ea5e9' },
  { name: 'Personal', value: 20, color: '#8b5cf6' },
  { name: 'Learning', value: 15, color: '#f59e0b' },
  { name: 'Health', value: 12, color: '#10b981' },
  { name: 'Finance', value: 8, color: '#f43f5e' },
]
