import { Link } from "react-router-dom";
import Users from './Users';

const Admin = () => {
    return (
        <main className='Admin'>
            <h1>Admins Page</h1>
            <br />
            <div className="tools">
                <Users />
                <button>Delete User</button>
            </div>

            {/* <div className="flexGrow">
                <Link to="/Welcome">Home</Link>
            </div> */}
        </main>
    )
}

export default Admin