import { useState, useEffect } from "react";
// import axios from '../api/axios';
// import useRefreshToken from "./hooks/useRefreshToken";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();
    // const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                // const response = await axios.get('/users', {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                // navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <article className="users">
            <h2>Users List ({users?.length ? users.length : 0})</h2>
            {users?.length
                ? (
                    <table>
                        <tbody>
                            <tr>
                                <th>User Name</th>
                                <th>ID</th>
                                <th>Role</th>
                                <th>Email</th>
                            </tr>
                            {users.sort((a, b) => a.username.localeCompare(b.username)).map((user, i) => (
                                <tr key={i}>
                                    <td>{user?.username}</td>
                                    <td>{user?._id}</td>
                                    <td>{user?.roles?.Admin ? 'Admin': 'User'}</td>
                                    <td>{user?.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>No users to display</p>
            }
            {/* <button onClick={() => refresh()}>Refresh</button> */}
        </article>
    );
};

export default Users;