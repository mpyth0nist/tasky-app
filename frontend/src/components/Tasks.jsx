import { useState, useEffect } from "react"
import api from '../api'

import '../styles/Tasks.css'


function Tasks( {todolist_id, todolist_title} ){
    const [tasks, setTasks] = useState([])
    const [task, setTask] = useState("")
    const [priority, setPriority] = useState("M")
    const [category, setCategory] = useState("")
    const [sortKey, setSortKey] = useState("default")
    const [isVisible, setVisible] = useState(false)
  
    const getTasks = () => {
        console.log(`todolist id is :${todolist_id}`)
        console.log('get tasks called')
        api.get(`api/todolists/${todolist_id}/`)
        .then((res) => 
            res.data
        ).then((userTasks) => setTasks(userTasks))

        console.log(tasks)

        
    }
    useEffect(() => getTasks(), [])

    const addTask = (e) => {
        e.preventDefault();

        api.post(`api/todolists/${todolist_id}/add/`, {task, priority, category, todo_list:todolist_id})
        .then((res) => setTasks([...tasks, res.data]))
    }

    const removeTask = (task_id) => {
        api.delete(`api/todolists/${todolist_id}/remove/${task_id}/`).then(
            (res) => {
                if(res.status === 204){
                    alert("Task Deleted!")
                    setTasks(tasks.filter((task) =>  task_id !== task.id))
                }else{
                    alert("Error occured while deleting the task.")
                }

            }

        )


    }

    const handleAdd = () => {
        setVisible(true)
    }


    const handleTaskCompletion = async (taskToUpdate) => {

        setTasks( prevTasks => 
            prevTasks.map(task => 
                task.id === taskToUpdate.id ? {...task, state:!taskToUpdate.state}
                : task
            )
        )
        try {
            await api.patch(`api/todolists/${todolist_id}/${taskToUpdate.id}/`, {
            'state': !taskToUpdate.state
            })
        }catch(error){
            alert(error)
        }
        }


    const sortTasks = () => {
        return [...tasks].sort((a,b) => {


            if(sortKey === 'priority'){
                const order = { H: 1, M: 2, L: 3}

                return order[a.priority] - order[b.priority]

            } else if(sortKey === 'state'){
                return a.state - b.state
            }

            else{
                return 0
            }

            
        })
    }
    
    return (
        <div className="tasks-container">
            <h1>{todolist_title}'s Tasks</h1>

            <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="priority">Sort by priority</option>
            <option value="state">Sort by Completion</option>
            </select>

            <ul className="tasks">
                { sortTasks().map((task) => <li key={task.id} className="task">
                    <input checked={task.state} onChange={() => handleTaskCompletion(task)} type="checkbox" className="task-state" />
                    <h3>{task.task}</h3>
                    <label className="task-category">{task.category}</label>
                    <label className="task-priority">{task.priority}</label>
                    <button className="remove-task" onClick={() => removeTask(task.id)}>-</button>
                    
                </li> ) }
            </ul>
            { isVisible ? <div className="add-task">
                <form onSubmit={addTask}>
                    <input type="text" placeholder="Task.." value={task} onChange= {(e) => setTask(e.target.value)}/>
                    <input placeholder="Category" value={category} onChange= {(e) => setCategory(e.target.value)} />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-control">
                    <option disabled>Select priority</option>
                        <option value="L">Low</option>
                        <option value="M">Medium</option>
                        <option value="H">High</option>
                    
                    </select>

                    <button type="submit">+</button>
                </form>
                
            </div> : <button class="add-tasks btn" onClick={handleAdd}>Add More tasks</button>
            
            }
            
        </div>
    )
}

export default Tasks;