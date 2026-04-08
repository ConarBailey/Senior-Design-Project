import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from "./hooks/useAuth";

const Nav = ({ search, setSearch }) => {
    const { auth } = useAuth();
    return (
        <nav className="Nav">
            {/* <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search">Search</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search food recipes"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form> */}
            <ul>
                {!auth?.user && (<li><Link to="login">Sign-In</Link></li>)}
                {auth?.user && (<li><Link to="foodID">Food-ID</Link></li>)}
                {auth?.user && (<li><Link to="foodName">Nutrition</Link></li>)}
                {auth?.user && (<li><Link to="foodLog">Food Log</Link></li>)}
                {auth?.user && auth.roles.includes(5150) && (<li><Link to="admin">Admin</Link></li>)}
                {/* <li><Link to="log">Log</Link></li> */}
                {auth?.user && (<li><Link to="logout">Sign-Out</Link></li>)}
                <li><Link to="about">About</Link></li>
            </ul>
        </nav>
    )
}

export default Nav