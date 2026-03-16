import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from './api/axios';

const LOGOUT_URL = '/logout';

const Logout = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
 
    const handleLogout = async (e) => {
        // e.preventDefault();

        try {
            const response = await axios.get(LOGOUT_URL,
                JSON.stringify(),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            // const accessToken = response?.data?.accessToken;
            // const roles = response?.data?.roles;
            // setAuth({ user, pwd, roles, accessToken });
            // setUser('');
            // setPwd('');
            // setSuccess(true);
            navigate('/welcome');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Logout Failed');
            }
            // errRef.current.focus();
        }
    }

  return (
    <main className='Log'>
        <h2>Logout</h2>
        {/* <p style={{ marginTop: '1rem' }}>
          This is the page of logout.<br/><br/>
        </p> */}
        <div className="flexGrow">
            <button onClick={handleLogout}>Sign Out</button>
        </div>

    </main>
  )
}

export default Logout