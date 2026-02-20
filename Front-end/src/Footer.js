import React from 'react'
const Footer = () => {
    const today = new Date();
    return (
        <footer className='Footer'>
            <p className='CopyRight'>Copyright &copy; {today.getFullYear()}</p>
            <img className='UTA' src='../deplogo.png'/>
        </footer>
    )
}

export default Footer