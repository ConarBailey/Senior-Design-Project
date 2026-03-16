import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from "./hooks/useAuth";

const Nav = ({ search, setSearch }) => {
    const { user } = useAuth();
    return (
        <nav className="Nav">
            <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search">Search</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search food recipes"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>
            <ul>
                <li><Link to="login">Sign In</Link></li>
                <li><Link to="logout">Sign Out</Link></li>
                <li><Link to="foodLog">Food Log</Link></li>
                {user && (
                        // Only show this link if the user is an admin
                         <li><Link to="foodLog">Food Log</Link></li>
               )}
                {/* <li><Link to="log">Log</Link></li> */}
                {/* <li><Link to="admin">Admin</Link></li> */}
                <li><Link to="about">About</Link></li>
            </ul>
        </nav>
    )
}

export default Nav