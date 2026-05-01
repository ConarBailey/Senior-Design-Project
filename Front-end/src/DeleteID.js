import { useState } from "react";
import axios from './api/axios';
import useAuth from "./hooks/useAuth";

const DeleteID = () => {
    const [id, setid] = useState();
    const { auth } = useAuth();
    const [Msg,setMsg] = useState('');
    const token = auth.accessToken

    const deleteUser = async ({id}) => {
        // token = auth.accessToken
        console.log({id})
        try {
            const response = await axios.delete('/users', 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                    data: {id}
                });
                console.log(response.data)
                setMsg('Deleted user successfully.')
        } catch (err) {
            if (!err?.response) {
                setMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setMsg('Missing User ID');
            } else if (err.response?.status === 403) {
                setMsg('Forbidden to delete Admin user');
            } else {
                setMsg('Failed to delete user');
            }
            // errRef.current.focus();
        }
    }


    return (
        <article className="deleteUser">
            <h3>ID</h3>
            <input
                type="text"
                id="id"
                name="id"
                value={id}
                onChange={(e) => setid(e.target.value)}
            />
            <button className="deleteButton" onClick={(e) => deleteUser({id})}>Delete ID</button>
            <br/><p>{Msg}</p>
        </article>
    );
};

export default DeleteID;



