import React from 'react'
import { useState, useEffect } from 'react';
import './FoodLog.css';
const socket = new WebSocket('ws://localhost:8080');
socket.binaryType = "arraybuffer";
let foodUpdate;
let currentDate = new Date();
let selectedDate = new Date();
let exportData = {date:selectedDate, meals:[]};

socket.addEventListener('open', event =>{
    console.log("Socket connection open.")
});

function Food(props) {
  function handleDelete(){
    props.delete(props.index);
  }

  return(
    <li>
      <p>{props.name} - {props.quantity}</p>
      <button onClick={handleDelete}>Delete</button>
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
  const [foods, setFoods] = useState([]);
  const [foodResults, setFoodResults] = useState([]);
  const [hideResults, setHideResults] = useState("showResults");
  const [hideSelection, setHideSelection] = useState("hideSelection");
  const [searchInput, setSearchInput] = useState("");
  const [selectedFood, setSelectedFood] = useState({food_name:'',servings:{serving:[{calories:0,protein:0,carbohydrate:0,fat:0}]}});
  const [quantityType, setQuantityType] = useState(0);
  const [quantityValue, setQuantityValue] = useState(1);
  let searchReturnFlag = false;
  var mealNutrition = {calories:0,protein:0,carbs:0,fats:0};
  
  if(!exportData[props.id]){
    exportData.meals[props.id] = {meal_id:props.id,meal_name:props.name,foods:[]};
  }

  exportData.meals[props.id].foods = [];
  for(let i = 0; i<foods.length;i++){
      mealNutrition.calories += foods[i].calories;
      mealNutrition.carbs += foods[i].Carbs;
      mealNutrition.fats += foods[i].Fats;
      mealNutrition.protein += foods[i].Protein;
      exportData.meals[props.id].foods.push({food_id:foods[i].food_id,quantityIndex:foods[i].quantityIndex,quantityValue:foods[i].quantityValue});
    }

  if(foodUpdate){
    foodUpdate=false;
    socket.send("LOG_UPDATE:"+JSON.stringify(exportData));
  }

  //Meal specific WebSocket listener. Must stay in component.
  socket.addEventListener('message', event => {
    //console.log(event.data)
    if(searchReturnFlag){
      if(event.data.slice(0,"SEARCH_RESULTS:".length)==="SEARCH_RESULTS:"){
        searchReturnFlag = false;
        try{
          var searchResults = JSON.parse(event.data.slice("SEARCH_RESULTS:".length,event.data.length));
          searchResults=searchResults.foods.food;
          setFoodResults(searchResults);
        }
        catch (error) {console.log(error);setFoodResults([])}
      } else if(event.data.slice(0,"SELECTION:".length)==="SELECTION:") {
        searchReturnFlag = false;
        var selectedFoodData = JSON.parse(event.data.slice("SELECTION:".length,event.data.length));
        //console.log(selectedFoodData);
        setSelectedFood(selectedFoodData.food);
      };
    }
  });

  //Propagates meal deletion upto parent component.
  function handleDelete(){
    props.delete(props.name);
  }

  function selectResult(food_id) {
    searchReturnFlag=true;
    socket.send("Food_id="+food_id);
    setHideResults("hideResults")
    setHideSelection("showSelection")
  }
  
  
  function addFood() {
    if(foods.length>0){
        setFoods([
        ...foods,
        {
          id:foods[foods.length-1].id+1,
          food_id:selectedFood.food_id, 
          food_name:selectedFood.food_name, 
          quantityIndex:quantityType, 
          quantityValue:quantityValue, 
          quantityName:selectedFood.servings.serving[quantityType].measurement_description, 
          calories: selectedFood.servings.serving[quantityType].calories*quantityValue,
          Protein: selectedFood.servings.serving[quantityType].protein*quantityValue,
          Carbs: selectedFood.servings.serving[quantityType].carbohydrate*quantityValue,
          Fats: selectedFood.servings.serving[quantityType].fat*quantityValue
        }
      ]);
    } else {
      setFoods([
        {
          id:0,
          food_id:selectedFood.food_id, 
          food_name:selectedFood.food_name, 
          quantityIndex:quantityType, 
          quantityValue:quantityValue, 
          quantityName:selectedFood.servings.serving[quantityType].measurement_description, 
          calories: selectedFood.servings.serving[quantityType].calories*quantityValue,
          Protein: selectedFood.servings.serving[quantityType].protein*quantityValue,
          Carbs: selectedFood.servings.serving[quantityType].carbohydrate*quantityValue,
          Fats: selectedFood.servings.serving[quantityType].fat*quantityValue
        }
      ]);
    }
    setFoodResults([]);
    setSearchInput("");
    setHideSelection("hideSelection");
    foodUpdate=true;
  }

  function deleteFood(id){
    setFoods(
      foods.filter(food => food.id !== id)
    );
    foodUpdate=true;
  }

  //Sends search signal through WebSocket
  function search(term) {
    setHideResults("showResults");
    setSearchInput(term);
    socket.send("Food_name="+term);
    searchReturnFlag = true;
  }

  //The meal component displays search results and saved foods in the form of unordered lists
  //These lists are created by iterating through the meal component state arrays.
  return (
    <div className='meal'>
      <h1>{props.name}</h1>
      <h2>Calories:{mealNutrition.calories}</h2>
      <h2>Protein:{mealNutrition.protein}</h2>
      <h2>Carbohydrates:{mealNutrition.carbs}</h2>
      <h2>Fats:{mealNutrition.fats}</h2>
      <button onClick={handleDelete}>Delete meal</button>
      <ul>
        {foods.map(
          (food) => {
            //console.log(food);
            return(<Food key={food.id} index={food.id} name={food.food_name} quantity={food.quantityValue + " " + food.quantityName} delete={deleteFood} />);
          }
        )}
      </ul>
      <input value={searchInput} onChange={e => search(e.target.value)}></input>
      <div id={hideSelection}>
        <h1>{selectedFood.food_name}</h1>
        <select name="quantity" id="quantity" onChange={e => setQuantityType(e.target.value)}>
          {selectedFood.servings.serving.map( (serving,index) =>
            <option value={index}>{serving.serving_description}</option>
          )}
        </select>
        <input value={quantityValue} onChange={e => setQuantityValue(e.target.value)}></input>
        <button onClick={addFood}>Add food</button>
        <p>Calories: {selectedFood.servings.serving[quantityType].calories*quantityValue}</p>
        <p>Protein: {selectedFood.servings.serving[quantityType].protein*quantityValue}</p>
        <p>Carbs: {selectedFood.servings.serving[quantityType].carbohydrate*quantityValue}</p>
        <p>Fats: {selectedFood.servings.serving[quantityType].fat*quantityValue}</p>
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
  var mealname = '';
  var logNutrition = {calories:0,protein:0,carbs:0,fats:0};

  for(let i = 0; i<meals.length;i++){
    logNutrition.calories += meals[i].calories;
    logNutrition.protein += meals[i].protein;
    logNutrition.carbs += meals[i].carbs;
    logNutrition.fats += meals[i].fats;
  }

  //addMeal and deleteMeal use standard array functions to add to or remove from a single meal to the meals state array.
  function addMeal() {
    if(meals.some(meal => meal.name === mealname)) {
      alert("Each meal must have its own name.")
    } else{
      console.log(meals.length)
      if(meals.length>0){
        setMeals([
          ...meals,
          { id:meals[meals.length-1].id+1, name:mealname, calories:0, protein:0, carbs:0, fats:0}
        ])
      } else {
        setMeals([{id:0, name:mealname, calories:0, protein:0, carbs:0, fats:0}])
      }
    };
  }

  function deleteMeal(name){
    setMeals(
      meals.filter(meal => meal.name !== name)
    );
  }

  function addNutrients(mealname,nutrients){
    console.log("MEALNAME: "+mealname);
    console.log("NUTRIENTS: "+nutrients);
    meals[meals.findIndex(x => x.name === mealname)].calories = nutrients.calories;
    meals[meals.findIndex(x => x.name === mealname)].carbs = nutrients.carbs;
    meals[meals.findIndex(x => x.name === mealname)].fats = nutrients.fats;
    meals[meals.findIndex(x => x.name === mealname)].protein = nutrients.protein;
    setMeals([meals]);
  }
  
  //Returns html forms that create meal components.
  //The meal components are returned in an unordered list.
  //Meal components are created by iterating through the meals state array.
  return (
    <div className="log">
      <h1>{selectedDate.toLocaleDateString()}</h1>
      <input onChange={e => mealname=e.target.value}></input>
      <button onClick={addMeal}>Add meal</button>
      <ul id="totals">
        <li>Calories: {logNutrition.calories}</li>
        <li>Protein: {logNutrition.protein}</li>
        <li>Carbohydrates: {logNutrition.carbs}</li>
        <li>Fats: {logNutrition.fats}</li>
      </ul>
      <ul>
        {meals.map(
          (meal) => {
            //console.log(meal);
            return(<Meal className="meal" key={meal.id} id={meal.id} name={meal.name}  delete={deleteMeal} nutrients={addNutrients}/>);
          }
        )}
      </ul>
    </div>
  )
}

export default FoodLog