import React from 'react';
import { useRef, useState } from 'react';
import './FoodLog.css';
import axios from './api/axios';
import useAuth from './hooks/useAuth';
const FOOD_LOG_URL = './foodlog';
const FOOD_ID_URL = './fatsecret'


function Food(props) {
  function handleDelete(){
    props.delete(props.index);
  }

  return(
    <li className='food'>
      <button onClick={handleDelete}>X</button>
      {props.name} - {props.quantity}
    </li>
  )
}

function SearchResult(food) {
  //Propagates search result selection upto meal component.
  function select(){
    food.select(food.food_id);
  }

  //Returns different buttons based on if the food is a brand or generic food.
  if(food.brand_name){
    return(
      <li><button className="searchResult" onClick={select}>{food.food_name} - {food.brand_name}</button></li>
    )
  } else {
    return(
      <li><button className="searchResult" onClick={select}>{food.food_name}</button></li>
    )
  }
}


function Meal(props) {
  var foods = props.foods;
  const [foodResults, setFoodResults] = useState([]);
  const [hideResults, setHideResults] = useState("showResults");
  const [hideSelection, setHideSelection] = useState("hideSelection");
  const [selectedFood, setSelectedFood] = useState({food_name:'',servings:{serving:[{calories:0,protein:0,carbohydrate:0,fat:0}]}});
  const [quantityType, setQuantityType] = useState(0);
  const [quantityValue, setQuantityValue] = useState(1);
  const [errMsg, setErrMsg] = useState('Please enter a food name to get the basic nutrition');
  let searchReturnFlag = false;

  //Propagates meal deletion upto parent component.
  function handleDelete(){
    props.delete(props.id);
  }

  async function selectResult(foodId) {
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
                setSelectedFood(result.food);
                setHideResults("hideResults")
                setHideSelection("showSelection")
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
    document.getElementById('searchInput').value = '';
  }
  
  
  function addFood() {
    if(foods.length>0){
        foods.push({
          id:foods[foods.length-1].id+1,
          food_id:selectedFood.food_id, 
          food_name:selectedFood.food_name, 
          serving_id:selectedFood.servings.serving[quantityType].serving_id,
          quantityIndex:quantityType, 
          quantityValue:quantityValue, 
          quantityName:selectedFood.servings.serving[quantityType].measurement_description,
          quantity:quantityValue *  selectedFood.servings.serving[quantityType].number_of_units + " " + selectedFood.servings.serving[quantityType].measurement_description,
          calories: selectedFood.servings.serving[quantityType].calories*quantityValue,
          protein: selectedFood.servings.serving[quantityType].protein*quantityValue,
          carbs: selectedFood.servings.serving[quantityType].carbohydrate*quantityValue,
          fats: selectedFood.servings.serving[quantityType].fat*quantityValue
        })
    } else {
        foods.push({
          id:0,
          food_id:selectedFood.food_id, 
          food_name:selectedFood.food_name, 
          serving_id:selectedFood.servings.serving[quantityType].serving_id,
          quantityIndex:quantityType, 
          quantityValue:quantityValue, 
          quantityName:selectedFood.servings.serving[quantityType].measurement_description,
          quantity:quantityValue *  selectedFood.servings.serving[quantityType].number_of_units + " " + selectedFood.servings.serving[quantityType].measurement_description, 
          calories: selectedFood.servings.serving[quantityType].calories*quantityValue,
          protein: selectedFood.servings.serving[quantityType].protein*quantityValue,
          carbs: selectedFood.servings.serving[quantityType].carbohydrate*quantityValue,
          fats: selectedFood.servings.serving[quantityType].fat*quantityValue
        });
    }
    setFoodResults([]);
    setQuantityType(0);
    setQuantityValue(1);
    setHideSelection("hideSelection")
    props.editFood(props.id,foods);
    document.getElementById('quantitySelect').value = '';
  }

  function deleteFood(id){
    foods = foods.filter(food => food.id !== id)
    props.editFood(props.id,foods);
  }

  async function search(foodName) {
  
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
              setFoodResults(result.foods.food);
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
          setHideResults("showResults");
  }

  //The meal component displays search results and saved foods in the form of unordered lists
  //These lists are created by iterating through the meal component state arrays.
  return (
    <div className='meal'>
      <div className='mealHeader'>
        <div className='mealName'><b>{props.name}</b></div>&nbsp;
        Calories: {Math.round(props.nutrients.calories)}&nbsp;
        Protein: {Math.round(props.nutrients.protein)}&nbsp;
        Carbohydrates: {Math.round(props.nutrients.carbs)}&nbsp;
        Fats: {Math.round(props.nutrients.fats)}
        <button className='deleteMeal' onClick={handleDelete}>Delete meal</button>
      </div>
      <ul>
        {foods.map(
          (food) => {
            //console.log(food);
            return(<Food key={food.id} index={food.id} name={food.food_name} quantity={food.quantity} delete={deleteFood} />);
          }
        )}
      </ul>
      <input id='searchInput' placeholder='Search term' onChange={e => search(e.target.value)}></input>
      <div id={hideSelection}>
        <h1>{selectedFood.food_name}</h1>
        <select name="quantity" id="quantity" onChange={e => setQuantityType(e.target.value)}>
          {selectedFood.servings.serving.map( (serving,index) =>
            <option value={index}>{serving.serving_description}</option>
          )}
        </select>&nbsp;
        <input id='quantitySelect' placeholder='Amount of servings' value={quantityValue} onChange={e => setQuantityValue(e.target.value)}></input>
        <button onClick={addFood}>Add food</button>
        <p>Calories: {Math.round(selectedFood.servings.serving[quantityType].calories*quantityValue)}</p>
        <p>Protein: {Math.round(selectedFood.servings.serving[quantityType].protein*quantityValue)}</p>
        <p>Carbs: {Math.round(selectedFood.servings.serving[quantityType].carbohydrate*quantityValue)}</p>
        <p>Fats: {Math.round(selectedFood.servings.serving[quantityType].fat*quantityValue)}</p>
      </div>
      <ul id={hideResults}>
        {foodResults.map(
          (food,index) =>
          {
            //console.log(food);
            return(<SearchResult key={index} food_name={food.food_name} brand_name={food.brand_name} food_id={food.food_id} select={selectResult}/>);
          }
        )}
      </ul>
    </div>
  )
  
}

const FoodLog = () => {
  const [meals, setMeals] = useState([]);
  const {auth} = useAuth();
  const username = auth?.user
  const [errMsg, setErrMsg] = useState('');
  const [logs, setLogs] = useState([]);
  var mealname = '';
  var date = new Date();
  var logNutrition = {calories:0,protein:0,carbs:0,fats:0};
  var exportData = {username:username,calorieGoal:2000,logDate:date,meals:[]};

  const handleSubmit = async (e) => {
        try {
            if(meals.length>0)
            {const response = await axios.post(FOOD_LOG_URL,
                JSON.stringify(exportData),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const result = response?.data
            console.log(result);
            } else {
              const URL = FOOD_LOG_URL + "/" + username
              const response = await axios.get(URL,
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            const result = response?.data
            console.log(result);
            setLogs(result);
            }
            
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

  if(meals.length>0){
    for(let i = 0; i<meals.length;i++){
      exportData.meals[i] = {meal_type:meals[i].name, foodIDs:[]};
      for(let x =0; x<meals[i].foods.length;x++){
        exportData.meals[i].foodIDs[x] = {
          food_id:meals[i].foods[x].food_id,
          serving_id:meals[i].foods[x].serving_id,
          quantity:meals[i].foods[x].quantityValue
        }
      }
      logNutrition.calories += meals[i].nutrients.calories;
      logNutrition.protein += meals[i].nutrients.protein;
      logNutrition.carbs += meals[i].nutrients.carbs;
      logNutrition.fats += meals[i].nutrients.fats;
  }
  }
  if(meals.length>0 || logs.length==0){
    handleSubmit();
}
  

  //addMeal and deleteMeal use standard array functions to add to or remove from a single meal to the meals state array.
  function addMeal() {
    if(meals.some(meal => meal.name === mealname)) {
      alert("Each meal must have its own name.")
    } else{
      if(meals.length>0){
        setMeals([
          ...meals,
          { id:meals[meals.length-1].id+1, name:mealname, foods:[], nutrients:{calories:0, protein:0, carbs:0, fats:0}}
        ])
      } else {
        setMeals([{id:0, name:mealname, foods:[], nutrients:{calories:0, protein:0, carbs:0, fats:0}}])
      }
    };
  }

  function deleteMeal(mealid){
    let mealsCopy = meals.filter(meal => meal.id !== mealid);
    for(let i = 0; i<mealsCopy.length;i++){
      if(mealsCopy[i].id>i){
        mealsCopy[i].id -= 1;
      }
    }
    setMeals(
      [...mealsCopy]
    );
  }

  function editFood(mealid,foods){
    meals[mealid].foods = foods;
    meals[mealid].nutrients = {calories:0,protein:0,carbs:0,fats:0};
    if(meals[mealid].foods.length>0){
      for(let i=0;i<meals[mealid].foods.length;i++){
            meals[mealid].nutrients.calories += meals[mealid].foods[i].calories;
            meals[mealid].nutrients.protein += meals[mealid].foods[i].protein;
            meals[mealid].nutrients.carbs += meals[mealid].foods[i].carbs;
            meals[mealid].nutrients.fats += meals[mealid].foods[i].fats;
    };}
    setMeals([...meals]);
  }

  async function importLog(logIndex) {
    var selectedFood;
    var mealArray = [];
    if(logIndex<0){return;}
    for(let i = 0; i<logs[logIndex].meals.length;i++){
      mealArray.push({id:i, name:logs[logIndex].meals[i].meal_type, foods:[], nutrients:{calories:0, protein:0, carbs:0, fats:0}})
      for(let z = 0; z<logs[logIndex].meals[i].foodIDs.length;z++){
        console.log(logs[logIndex].meals[i].foodIDs[z].food_id);
        let foodId = logs[logIndex].meals[i].foodIDs[z].food_id;
        try {   
                const response = await axios.post(FOOD_ID_URL,
                    JSON.stringify({foodId}),
                    {
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    }
                );
                const result = response?.data;
                selectedFood=result.food;
                console.log(selectedFood);
                var quantityType=selectedFood.servings.serving.findIndex((serving) => serving.serving_id == logs[logIndex].meals[i].foodIDs[z].serving_id);
                mealArray[i].foods.push({
                id:z,
                food_id:selectedFood.food_id, 
                food_name:selectedFood.food_name, 
                serving_id:logs[logIndex].meals[i].foodIDs[z].serving_id,
                quantityIndex:quantityType, 
                quantityValue:logs[logIndex].meals[i].foodIDs[z].quantity, 
                quantityName:selectedFood.servings.serving[quantityType].measurement_description,
                quantity:logs[logIndex].meals[i].foodIDs[z].quantity *  selectedFood.servings.serving[quantityType].number_of_units + " " + selectedFood.servings.serving[quantityType].measurement_description, 
                calories: selectedFood.servings.serving[quantityType].calories*logs[logIndex].meals[i].foodIDs[z].quantity,
                protein: selectedFood.servings.serving[quantityType].protein*logs[logIndex].meals[i].foodIDs[z].quantity,
                carbs: selectedFood.servings.serving[quantityType].carbohydrate*logs[logIndex].meals[i].foodIDs[z].quantity,
                fats: selectedFood.servings.serving[quantityType].fat*logs[logIndex].meals[i].foodIDs[z].quantity
                });
                mealArray[i].nutrients.calories += mealArray[i].foods[z].calories;
                mealArray[i].nutrients.protein += mealArray[i].foods[z].protein;
                mealArray[i].nutrients.carbs += mealArray[i].foods[z].carbs;
                mealArray[i].nutrients.fats += mealArray[i].foods[z].fats;
            } catch (err) {
              console.log(err);
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
    }
    
    console.log(mealArray);
    setMeals(mealArray);
  }
  
  //Returns html forms that create meal components.
  //The meal components are returned in an unordered list.
  //Meal components are created by iterating through the meals state array.
  return (
    <div className="log">
      <p id='error'>{errMsg}</p>
      <div>
        <input onChange={e => mealname=e.target.value}></input>
        <button onClick={addMeal}>Add meal</button>
      </div>
      <h3>Totals:</h3>
      <div>
        Calories: {Math.round(logNutrition.calories)}&nbsp;
        Protein: {Math.round(logNutrition.protein)} &nbsp;
        Carbohydrates: {Math.round(logNutrition.carbs)} &nbsp;
        Fats: {Math.round(logNutrition.fats)}
      </div>
      <div>
        <select name="logs" id="logs" onChange={e => importLog(e.target.value)}>
          <option value={-1}>Import a log</option>
          {logs.map( (log,index) =>
            <option value={index}>{log.logDate}</option>
          )}
        </select>
      </div>
      <ul id='mealList'>
        {meals.map(
          (meal) => {
            //console.log(meal);
            return(<Meal className="meal" key={meal.id} id={meal.id} name={meal.name}  delete={deleteMeal} nutrients={meal.nutrients} foods={meal.foods} editFood={editFood}/>);
          }
        )}
      </ul>
    </div>
  )
}

export default FoodLog