// import { useState } from "react";
// import axios from '../api/axios';
// import useRefreshToken from "./hooks/useRefreshToken";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
// import { useNavigate, useLocation } from "react-router-dom";
import axios from './api/axios';
import useAuth from "./hooks/useAuth";

const useDeleteUser = () => {
    // const [users, setUsers] = useState();
    // const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    // const navigate = useNavigate();
    // const location = useLocation();
    const token = auth.accessToken
    // useEffect(() => {
        // let isMounted = true;
        const controller = new AbortController();

        const deleteUser = async ({id}) => {
            // token = auth.accessToken
            try {
                const response = await axios.delete('/users', 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json' 
                        },
                        data: {
                            id: {id}
                        }
                        // withCredentials: true
                    });
                    {(Object.keys(response.data).length > 0)
                    ? console.log('Deleted successfully:', response.data)
                    : console.log('User not found.')
                    }
                    // isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                // navigate('/login', { state: { from: location }, replace: true });
            }
        }

        return deleteUser;

};

export default useDeleteUser;