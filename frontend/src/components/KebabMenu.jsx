import { useState } from 'react'

function KebabMenu(){

    const [isOpen, setIsOpen] = useState(false)

    const toggleOpenMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="dropdown-menu">
            <button onClick={toggleOpenMenu}>
                ⋮
            </button>

            {
                isOpen ?    <ul>
                            <li>
                                <a>Settings</a>
                            </li>

                            <li>
                                <a>Logout</a>
                            </li>
                            </ul> 
            : null
            }

        </div>
    )
}

export default KebabMenu;