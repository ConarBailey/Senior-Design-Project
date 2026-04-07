import React from 'react'

const Header = ({title}) => {
  return (
    <header className='Header'>
        <img className='AppLogo' src='../logo.png'/>
        <h1>{title}</h1>
        <img className='UTA' src='../deplogo2.png'/>

    </header>
  )
}

export default Header