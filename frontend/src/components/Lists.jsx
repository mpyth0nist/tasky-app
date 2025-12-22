import React, { useState } from 'react'
import '../styles/Lists.css'

import api from '../api'
function Lists({ todolist, onShowTasks, onDelete }){



    return(
        
        <div className="list-container">
            <h2>{todolist.title}</h2>
            <p>{todolist.description}</p>
            <div className="todolist-options">
                <button className="delete-list" onClick={ () => onDelete(todolist.id) }>Delete</button>
                <button className="show-list" onClick = { () => onShowTasks(todolist.id, todolist.title) }>Show Tasks</button>
            </div>

        </div> 
        

        
    )
}

export default Lists;