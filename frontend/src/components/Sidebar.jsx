
function Navbar({ handleClick, tabs }){



    return (
        <div className="navbar-container">
        
        { tabs.map((tab) => <button key={tab} className='navbar-tab' onClick={() => handleClick({tab})}>{tab}</button>)}
    </div>
    )
}

export default Navbar;