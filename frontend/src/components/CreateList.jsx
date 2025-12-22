import { useState } from 'react'
import api from '../api'

function CreateList({ todolists , setTodolists }){

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const createList = (e) => {
        
        e.preventDefault();

        api.post('api/todolists/', {title, description}).then((res) => {
            if(res.status === 201) {
                alert("List Created, It's time to fill it with tasks!")
            } else{
                alert("Error while creating your list")
            }
            setTodolists([...todolists, res.data])
        }
        )


    }

    

    return (
    <form onSubmit={createList} className="create-list-form">
        <input type="text" value={title} required onChange={(e) => setTitle(e.target.value)} className="title" placeholder="List Name" />

        <textarea placeholder='Description' className='title' onChange={(e)=> setDescription(e.target.value)} value={description}> 
        </textarea>
        <button type="submit">Create!</button>
    </form>
    )
}

export default CreateList;