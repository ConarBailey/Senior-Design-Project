import {useRef, useState} from 'react'
import axios from './api/axios';
import useAuth from './hooks/useAuth';

const FOOD_ID_URL = './fatSecret';

const FoodId = () => {
    const {auth} = useAuth();
    const username = auth?.user
    const [foodName, setfoodName] = useState('cheeseburger');
    const [errMsg, setErrMsg] = useState('Please enter a food name to get the basic nutrition');
    const errRef = useRef();
    const [foodServices, setfoodServices] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(FOOD_ID_URL,
                JSON.stringify({foodName}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const result = response?.data
            console.log(result);
            setfoodServices(result);
        } catch (err) {
            if(!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing foodId');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    }
        return (
            <main className='FoodName'>
                <div className='split-container-FoodName'>
                    <h2>{username}</h2>
                    <div className='split-container'>
                    <h3>Food Name</h3>
                    <input
                        type='text'
                        id="food_Name"
                        name="food_Name"
                        placeholder="cheeseBurger"
                        value={foodName}
                        onChange={(e) => setfoodName(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Search</button>
                </div>
            </div>
            <div className='foodResults'>
                {foodServices?.foods?.food?.length
                ? (
                    <table>
                        <tbody>
                            <tr>
                                <th>Food ID</th>
                                <th>Food Name</th>
                                <th>Food Description</th>
                            </tr>
                            {foodServices.foods?.food.map((food, i) => (
                                <tr key={i}>
                                    <td>{food.food_id}</td>
                                    <td>{food.food_name}</td>
                                    <td>{food.food_description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <center><p></p></center>
            }
            </div>
        </main>
    )
}

export default FoodId