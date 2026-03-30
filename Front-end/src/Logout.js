import { useNavigate } from 'react-router-dom';
import useLogout from './hooks/useLogOut';

const Logout = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const logout = useLogout();
    const signOut = async () => {
        await logout();
        navigate('/Welcome');
    }

  return (
    <main className='Log'>
        <div className="flexGrow">
            <h2>Logout</h2>
            <button onClick={signOut}>Sign Out</button>
        </div>

    </main>
  )
}

export default Logout