import { useState, useEffect } from 'react'
import api from '../api'
import { ENDPOINTS } from '../constants'
import '../styles/Tasks.css'


function Tasks({ todolist_id, todolist_title }) {
    const [tasks, setTasks] = useState([])
    const [task, setTask] = useState('')
    const [priority, setPriority] = useState('M')
    const [category, setCategory] = useState('')
    const [sortKey, setSortKey] = useState('default')
    const [isVisible, setVisible] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        api.get(ENDPOINTS.TASKS(todolist_id))
            .then((res) => {
                if (!cancelled) {
                    // Handle paginated or plain array response; always store an array
                    const data = res.data.results ?? res.data
                    setTasks(Array.isArray(data) ? data : [])
                }
            })
            .catch(() => {
                if (!cancelled) setError('Failed to load tasks.')
            })

        return () => { cancelled = true }
    }, [todolist_id])

    const addTask = (e) => {
        e.preventDefault()
        setError(null)

        api.post(ENDPOINTS.TASKS(todolist_id), { task, priority, category })
            .then((res) => setTasks((prev) => [...prev, res.data]))
            .catch(() => setError('Failed to add task. Please try again.'))
    }

    const removeTask = (task_id) => {
        api.delete(ENDPOINTS.REMOVE_TASK(todolist_id, task_id))
            .then((res) => {
                if (res.status === 204) {
                    setTasks(tasks.filter((t) => t.id !== task_id))
                } else {
                    setError('Failed to delete task.')
                }
            })
            .catch(() => setError('Failed to delete task. Please try again.'))
    }

    const handleTaskCompletion = async (taskToUpdate) => {
        // Optimistic update
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskToUpdate.id ? { ...t, state: !taskToUpdate.state } : t
            )
        )
        try {
            await api.patch(ENDPOINTS.TASK(todolist_id, taskToUpdate.id), {
                state: !taskToUpdate.state
            })
        } catch {
            // Roll back on failure
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskToUpdate.id ? { ...t, state: taskToUpdate.state } : t
                )
            )
            setError('Failed to update task.')
        }
    }

    const sortTasks = () => {
        return [...tasks].sort((a, b) => {
            if (sortKey === 'priority') {
                const order = { H: 1, M: 2, L: 3 }
                return order[a.priority] - order[b.priority]
            } else if (sortKey === 'state') {
                return a.state - b.state
            }
            return 0
        })
    }

    return (
        <div className="tasks-container">
            <h1>{todolist_title}'s Tasks</h1>

            {error && <p className="inline-error">{error}</p>}

            <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                <option value="default">Default order</option>
                <option value="priority">Sort by priority</option>
                <option value="state">Sort by completion</option>
            </select>

            <ul className="tasks">
                {sortTasks().map((task) => (
                    <li key={task.id} className="task">
                        <input
                            checked={task.state}
                            onChange={() => handleTaskCompletion(task)}
                            type="checkbox"
                            className="task-state"
                        />
                        <h3>{task.task}</h3>
                        <label className="task-category">{task.category}</label>
                        <label className="task-priority">{task.priority}</label>
                        <button
                            className="remove-task"
                            onClick={() => removeTask(task.id)}
                            aria-label="Remove task"
                        >
                            −
                        </button>
                    </li>
                ))}
            </ul>

            {isVisible ? (
                <div className="add-task">
                    <form onSubmit={addTask}>
                        <input
                            type="text"
                            placeholder="Task…"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-control"
                        >
                            <option value="L">Low</option>
                            <option value="M">Medium</option>
                            <option value="H">High</option>
                        </select>
                        <button type="submit">+ Add</button>
                    </form>
                </div>
            ) : (
                <button className="add-tasks btn" onClick={() => setVisible(true)}>
                    Add More Tasks
                </button>
            )}
        </div>
    )
}

export default Tasks