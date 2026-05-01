import { Link } from "react-router-dom";
import Users from './Users';
import DeleteID from './DeleteID';

const Admin = () => {
    return (
        <main className='Admin'>
            <div className="split-container-Admin">
                <h1>Admins Page</h1>
            </div>
            <div className="tools">
                <Users />
                <DeleteID />
            </div>
        </main>
    )
}

export default Admin
