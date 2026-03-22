import React from 'react'
import { useState } from 'react';
import './FoodLog.css';
const socket = new WebSocket('ws://localhost:8080');
socket.binaryType = "arraybuffer";

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
  var foods = props.foods;
  const [foodResults, setFoodResults] = useState([]);
  const [hideResults, setHideResults] = useState("showResults");
  const [hideSelection, setHideSelection] = useState("hideSelection");
  const [searchInput, setSearchInput] = useState("");
  const [selectedFood, setSelectedFood] = useState({food_name:'',servings:{serving:[{calories:0,protein:0,carbohydrate:0,fat:0}]}});
  const [quantityType, setQuantityType] = useState(0);
  const [quantityValue, setQuantityValue] = useState(1);
  let searchReturnFlag = false;

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
    props.delete(props.id);
  }

  function selectResult(food_id) {
    searchReturnFlag=true;
    socket.send("Food_id="+food_id);
    setHideResults("hideResults")
    setHideSelection("showSelection")
  }
  
  
  function addFood() {
    if(foods.length>0){
        foods.push({
          id:foods[foods.length-1].id+1,
          food_id:selectedFood.food_id, 
          food_name:selectedFood.food_name, 
          quantityIndex:quantityType, 
          quantityValue:quantityValue, 
          quantityName:selectedFood.servings.serving[quantityType].measurement_description, 
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
          quantityIndex:quantityType, 
          quantityValue:quantityValue, 
          quantityName:selectedFood.servings.serving[quantityType].measurement_description, 
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
  }

  function deleteFood(id){
    foods = foods.filter(food => food.id !== id)
    props.editFood(props.id,foods);
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
      <h2>Calories:{props.nutrients.calories}</h2>
      <h2>Protein:{props.nutrients.protein}</h2>
      <h2>Carbohydrates:{props.nutrients.carbs}</h2>
      <h2>Fats:{props.nutrients.fats}</h2>
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log(meals);
  let currentDate = new Date();
  var mealname = '';
  var logNutrition = {calories:0,protein:0,carbs:0,fats:0};
  var exportData = {logDate:selectedDate,meals:[]};

  if(meals.length>0){
    for(let i = 0; i<meals.length;i++){
      exportData.meals[i] = {id:meals[i].id, foods:[]};
      for(let x =0; x<meals[i].foods.length;x++){
        exportData.meals[i].foods[x] = {
          food_id:meals[i].foods[x].food_id,
          quantityIndex:meals[i].foods[x].quantityIndex,
          quantityValue:meals[i].foods[x].quantityValue
        }
      }
      logNutrition.calories += meals[i].nutrients.calories;
      logNutrition.protein += meals[i].nutrients.protein;
      logNutrition.carbs += meals[i].nutrients.carbs;
      logNutrition.fats += meals[i].nutrients.fats;
  }}
  console.log(exportData);
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
  
  //Returns html forms that create meal components.
  //The meal components are returned in an unordered list.
  //Meal components are created by iterating through the meals state array.
  return (
    <div className="log">
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
            return(<Meal className="meal" key={meal.id} id={meal.id} name={meal.name}  delete={deleteMeal} nutrients={meal.nutrients} foods={meal.foods} editFood={editFood}/>);
          }
        )}
      </ul>
    </div>
  )
}

export default FoodLog