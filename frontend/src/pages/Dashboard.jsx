import '../styles/Dashboard.css'
import { useState, useEffect } from 'react'
import api from '../api'
import Navbar from '../components/Sidebar'
import Lists from '../components/Lists'
import Tasks from '../components/Tasks'
import '../styles/CreateList.css'
import CreateList from '../components/CreateList'
import { ENDPOINTS } from '../constants'


function Dashboard() {
    const [todoLists, setTodoLists] = useState([])
    const [tabs] = useState(['My Todolists', 'Create a Todolist'])
    const [activeTab, setActiveTab] = useState(null)
    const [activeTodolistId, setActiveTodolistId] = useState(null)
    const [activeTodolistTitle, setActiveTodolistTitle] = useState('')
    const [error, setError] = useState(null)

    const handleActive = (tab) => {
        setActiveTab(tab.tab)
        setActiveTodolistId(null)
        setError(null)
    }

    useEffect(() => {
        getLists()
    }, [])

    const getLists = () => {
        api.get(ENDPOINTS.TODOLISTS)
            .then((res) => setTodoLists(res.data.results ?? res.data))
            .catch(() => setError('Failed to load your lists. Please refresh.'))
    }

    const handleDelete = (list_id) => {
        api.delete(ENDPOINTS.DELETE_LIST(list_id))
            .then((res) => {
                if (res.status === 204) {
                    setTodoLists(todoLists.filter((list) => list.id !== list_id))
                } else {
                    setError('Failed to delete the list.')
                }
            })
            .catch(() => setError('Failed to delete the list. Please try again.'))
    }

    const handleShowTasks = (list_id, list_title) => {
        setActiveTodolistId(list_id)
        setActiveTodolistTitle(list_title)
        setError(null)
    }

    const handleBacktoLists = () => {
        setActiveTodolistId(null)
    }

    return (
        <div className="container">
            <Navbar handleClick={handleActive} tabs={tabs} />
            <div className='todolists-container'>
                {error && <p className="inline-error">{error}</p>}

                {activeTab === 'Create a Todolist' && (
                    <CreateList
                        todolists={todoLists}
                        setTodolists={setTodoLists}
                        onCreated={() => setActiveTab('My Todolists')}
                    />
                )}

                {activeTab === 'My Todolists' && (
                    <>
                        {activeTodolistId === null ? (
                            todoLists.map((todolist) => (
                                <Lists
                                    key={todolist.id}
                                    todolist={todolist}
                                    onShowTasks={handleShowTasks}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <>
                                <button onClick={handleBacktoLists} className="get-back-btn">
                                    ← Back to lists
                                </button>
                                <Tasks
                                    todolist_id={activeTodolistId}
                                    todolist_title={activeTodolistTitle}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard