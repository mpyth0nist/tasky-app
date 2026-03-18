import { useState, useEffect, useRef } from 'react'
import api from '../api'
import { ENDPOINTS } from '../constants'
import '../styles/CreateList.css'

function CreateList({ todolists, setTodolists, onCreated }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const titleRef = useRef(null)

    useEffect(() => {
        titleRef.current?.focus()
    }, [])

    const createList = (e) => {
        e.preventDefault()
        setError(null)

        api.post(ENDPOINTS.TODOLISTS, { title, description })
            .then((res) => {
                if (res.status === 201) {
                    setTodolists([...todolists, res.data])
                    onCreated?.()
                }
            })
            .catch(() => setError('Failed to create list. Please try again.'))
    }

    return (
        <form onSubmit={createList} className="create-list-form">
            {error && <p className="inline-error">{error}</p>}

            <input
                ref={titleRef}
                type="text"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className="title"
                placeholder="List Name"
            />
            <textarea
                placeholder="Description (optional)"
                className="title"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />
            <button type="submit">Create!</button>
        </form>
    )
}

export default CreateList