import { Link } from "react-router-dom";
import Users from './Users';
import useDeleteUser from './DeleteUser';
const Admin = () => {
    const deleteUser = useDeleteUser();
    return (
        <main className='Admin'>
            <div className="split-container-Admin">
                <h1>Admins Page</h1>
                {/* <button className="Delete_button" onClick={deleteUser()}>Delete User</button> */}
            </div>
            <div className="tools">
                <Users />
            </div>
        </main>
    )
}

export default Admin