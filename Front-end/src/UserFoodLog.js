import {useState, useEffect } from 'react'
import axios from './api/axios';
import useAuth from "./hooks/useAuth";

const FOOD_LOG_URL = '/foodlog';

const UserFoodLog = () => {
    const {auth} = useAuth();
    const username = auth?.user
    const [errMsg, setErrMsg] = useState('');
    // const errRef = useRef();
    const [userfoodLog, setuserfoodLog] = useState();


        useEffect(() => {
            let isMounted = true;
            const controller = new AbortController();
    
            const getUserLog = async () => {
                try {
                    const URL = FOOD_LOG_URL + "/" + username 
                    const response = await axios.get(URL);
                    const result = response?.data
                    setuserfoodLog(result)
                    console.log(userfoodLog);
                    isMounted && setuserfoodLog(response.data);
                } catch (err) {
                    if (!err?.response) {
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
    
            getUserLog();
    
            return () => {
                isMounted = false;
                controller.abort();
            }
        }, [])
    

    return (
        <main className='FoodId'>
            <div className='split-container-FoodID'>
                <h2>User: {username}</h2>
                <div className='split-container'>
                    {/* <h3>User Name</h3> */}
                    {/* <label htmlFor="food_ID">FoodID</label>
                    {/* <input */}
                        {/* type="text"
                        id="food_ID"
                        name="food_ID"
                        // placeholder={username}
                        pattern="[0-9]"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                    /> */}
                    {/* <button onClick={handleSubmit}>Search</button> */}
                </div>
            </div>
            <div className="logResults">
                {userfoodLog?.length
                    ? (
                        <table>
                            <h3>Calorie Goal: {userfoodLog?.[userfoodLog.length-1].calorieGoal}</h3>
                            <h3>Log Date: {userfoodLog?.[userfoodLog.length-1].logDate}</h3>
                            <tbody>
                                {userfoodLog?.[userfoodLog.length-1].meals.map((meal, i) => (
                                    <tr key={i}>
                                        <h3>{meal.meal_type}</h3>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>food id</th>
                                                    <th>serving id</th>
                                                    <th>quantity</th>
                                                </tr>
                                                {meal?.foodIDs.map((item, j) => (
                                                    <tr key={j}>
                                                        <td>{item.food_id}</td> 
                                                        <td>{item.serving_id}</td> 
                                                        <td>{item.quantity}</td> 
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No User Food Log</p>
                }                
            </div>
        </main>
    )
}

export default UserFoodLog

