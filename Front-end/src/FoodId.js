import {useRef, useState} from 'react'
import axios from './api/axios';
import useAuth from './hooks/useAuth';

const FOOD_ID_URL = './fatSecret';

const FoodId = () => {
    const [foodId, setfoodId] = useState('1234');
    const {auth} = useAuth();
    const username = auth?.user
    const [errMsg, setErrMsg] = useState('');
    // const {errMsg, setErrMsg} = useState('Please enter a food name to get the basic nutrition');
    const errRef = useRef();
    const [foodServices, setfoodServices] = useState();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(FOOD_ID_URL,
                JSON.stringify({foodId}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const result = response?.data
            console.log(result);
            console.log(result.food.servings.serving.findIndex((serving) => serving.serving_id == 1392))
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
            <main className='FoodId'>
                 <div className='split-container-FoodID'>
                    <h2>{username}</h2>
                    <div className='split-container'>
                    <h3>Food ID</h3>
                    <input
                        type='text'
                        id="food_ID"
                        name="food_ID"
                        placeholder="1234"
                        value={foodId}
                        onChange={(e) => setfoodId(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Search</button>
                </div>
            </div>
            <div className='foodResults'>
                {foodServices?.food?.servings?.serving.length
                ? (
                    <table>
                        <h3>Food Name: {foodServices?.food?.food_name}</h3>
                        <tbody>
                            <tr>
                                <th>Serving Description</th>
                                <th>Calories</th>
                                <th>Fat</th>
                                <th>Protein</th>
                                <th>Sodium</th>
                                <th>Cholesterol</th>
                                <th>Carbohydrate</th>
                            </tr>
                            {foodServices.food.servings.serving.map((serving, i) => (
                                <tr key={i}>
                                    <td>{serving.serving_description}</td>
                                    <td>{serving.calories}</td>
                                    <td>{serving.fat}</td>
                                    <td>{serving.protein}</td>
                                   <td>{serving.sodium}</td>
                                   <td>{serving.cholesterol}</td>
                                   <td>{serving.carbohydrate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p></p>
            }
            </div>
        </main>
    )
}

export default FoodId