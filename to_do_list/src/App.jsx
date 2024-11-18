import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card } from './components/ui/card'
import { Trash2, Moon, Sun } from 'lucide-react'

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  })

  // Todos with localStorage persistence
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })

  const [input, setInput] = useState('')
  const [categories] = useState(['Work', 'Personal', 'Shopping', 'Health'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priority, setPriority] = useState('low')
  const [dueDate, setDueDate] = useState(null)
  const [sortBy, setSortBy] = useState('date')

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const addTodo = (e) => {
    e.preventDefault()
    if (input.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: input,
        completed: false,
        category: selectedCategory,
        priority: priority,
        dueDate: dueDate,
        createdAt: new Date().toISOString(),
      }])
      setInput('')
      setPriority('low')
      setDueDate(null)
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const getSortedTodos = () => {
    return [...todos].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dueDate || b.createdAt) - new Date(a.dueDate || a.createdAt)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'status':
          if (a.completed === b.completed) return 0
          return a.completed ? 1 : -1
        default:
          return 0
      }
    })
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="fixed top-4 right-4"
        >
          {theme === 'light' ? 
            <Moon className="h-5 w-5" /> : 
            <Sun className="h-5 w-5" />
          }
        </Button>

        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'
        }`}>
          <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`border rounded-md p-2 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'
              }`}
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`border rounded-md p-2 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'
              }`}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`border rounded-md p-2 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'
              }`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
              className={`border rounded-md p-2 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'
              }`}
            />
          </div>

          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new todo..."
              className={`flex-1 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'
              }`}
            />
            <Button type="submit">Add</Button>
          </form>

          <div className="space-y-2">
            {getSortedTodos().map(todo => (
              <div
                key={todo.id}
                className={`flex items-center gap-2 p-3 border rounded-lg 
                  transition-all duration-200 
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}
                  ${todo.priority === 'high' ? 'border-red-500' :
                    todo.priority === 'medium' ? 'border-yellow-500' : ''}
                  hover:border-2
                  ${theme === 'dark' ? 'hover:border-green-500' : 'hover:border-black'}
                  cursor-pointer
                `}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex-1">
                  <span className={todo.completed ? 'line-through opacity-50' : ''}>
                    {todo.text}
                  </span>
                  <div className="text-sm opacity-75">
                    {todo.category} • {todo.priority} priority
                    {todo.dueDate && ` • Due: ${todo.dueDate}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App
