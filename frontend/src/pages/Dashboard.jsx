import '../styles/Dashboard.css'
import { useState, useEffect } from 'react'
import api from '../api'
import Navbar from '../components/Sidebar'
import Lists from '../components/Lists'
import Tasks from '../components/Tasks'
import '../styles/CreateList.css'
import CreateList from '../components/CreateList'


function Dashboard(){
    const [todoLists, setTodoLists] = useState([])
    const [tabs , setTabs] = useState(["My Todolists", "Create a Todolist"])
    const [activeTab, setActiveTab] = useState(null)
    const [activeTodolistId, setActiveTodolistId] = useState(null)
    const [activeTodolistTitle, setActiveTodolistTitle] = useState("")

    const handleActive = (tab) => {
        console.log('activation function triggered')
        setActiveTab(tab.tab)
        setActiveTodolistId(null)
    }

    useEffect(() => { getLists() }, [])

   
    const getLists = () => { 
        api.get('/api/todolists/')
        .then((res) => res.data)
        .then((tasklist) => setTodoLists(tasklist))
        .catch((error) => alert(error))
    }


    const handleDelete = (list_id) => {
        api.delete(`api/todolists/delete/${list_id}/`)
        .then((res) => {
            if(res.status === 204){
                alert('List deleted')
            }else{
                alert('Failed to delete')
            }
        })
        .catch((error) => alert(error))
        setTodoLists(todoLists.filter((list) => list.id !== list_id ))
    }

    const handleShowTasks = (list_id , list_title) => {
        setActiveTodolistId(list_id)
        setActiveTodolistTitle(list_title)
    }

    const handleBacktoLists = () => {
        setActiveTodolistId(null)
    }


    


return(
        <div className="container">
            <Navbar handleClick={handleActive} tabs={tabs} setTabs={setTabs}/>
            <div className='todolists-container'>
                {/* Render CreateList if 'Create a Todolist' tab is active */}
                {activeTab === 'Create a Todolist' && (
                    <CreateList todolists={todoLists} setTodolists={setTodoLists} />
                )}

                {/* Render 'My Todolists' content if that tab is active */}
                {activeTab === 'My Todolists' && (
                    // This entire block is the content for the 'My Todolists' tab
                    <>
                        {/* Conditional rendering based on activeTodolistId */}
                        {activeTodolistId === null ? (
                            // If no specific todolist is selected, show all lists
                            todoLists.map((todolist) => (
                                <Lists
                                    key={todolist.id} // Don't forget the key!
                                    todolist={todolist}
                                    onShowTasks={handleShowTasks}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            // If a specific todolist is selected, show its tasks
                            <>
                                <button onClick={handleBacktoLists} class="get-back-btn">Get back to lists</button>
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
    );
}

export default Dashboard;