import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

function WelcomePage() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate('/Home'); // Redirect to the '/home' path
  //   }, 10000); // 2000 milliseconds = 2 seconds

  //   return () => clearTimeout(timer); // Cleanup the timer
  // }, [navigate]);

  return (
    //  {
    //   constructor(parameters) {
        
    //   }
    // }>
    <main className='Welcome'>
      <center>
        <h1>Welcome to Calorie Counter</h1><br/>
        {/* <img className='Pic1' src='../iced-coffee.png'/> */}
        <img className='Pic1' src='../logo.png'/>
        <br/><a href="login"><h2>Please Sign-in</h2></a><br/>
        </center>
    </main>
  );
}

export default WelcomePage;
