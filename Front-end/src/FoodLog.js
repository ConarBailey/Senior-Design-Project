import React from 'react'
import { useState } from 'react';
import './FoodLog.css';
const socket = new WebSocket('ws://localhost:8080');
socket.binaryType = "arraybuffer";
let mealID = 0;

socket.addEventListener('open', event =>{
    console.log("Socket connection open.")
});

function Food(props) {
  return(
    <li>
      <p>{props.name}</p>
    </li>
  )
}

function SearchResult(food) {
  //Propagates search result selection upto meal component.
  function select(){
    food.selectResult(food.food_id);
  }

  //Returns different buttons based on if the food is a brand or generic food.
  if(food.brand_name){
    return(
      <button className="searchResult" onClick={select}>{food.food_name} - {food.brand_name}</button>
    )
  } else {
    return(
      <li><button className="searchResult" onClick={select}>{food.food_name}</button></li>
    )
  }
}

function DataEntry(food) {

}

function Meal(props) {
  const [foods, setFoods] = useState([]);
  const [foodResults, setFoodResults] = useState([]);
  const [hideResults, setHideResults] = useState("showResults");
  const [searchInput, setSearchInput] = useState("");
  const [selectedFood, setSelectedFood] = useState([]);
  let foodID = 0;
  let searchID = 0;
  let searchReturnFlag = false;

  //Meal specific WebSocket listener. Must stay in component.
  socket.addEventListener('message', event => {
    console.log(event.data)
    if(searchReturnFlag){
      if(event.data.slice(0,"SEARCH_RESULTS:".length)==="SEARCH_RESULTS:"){
        searchReturnFlag = false;
        try{
          var searchResults = JSON.parse(event.data.slice("SEARCH_RESULTS:".length,event.data.length));
          searchResults=searchResults.foods.food;
          setFoodResults(searchResults);
        }
        catch (error) {console.log(error);setFoodResults([])}
      };
    }
  });

  //Propagates meal deletion upto parent component.
  function handleDelete(){
    props.delete(props.name);
  }

  function selectResult(food_id) {
    /*TODO: hide the search results, display detailed nutrition,
    allow quantity selection, calculate nutrition basedo on quantity selected,
    and send data to addFood */
  }
  
  /* TODO: After selectResult is completed.
  function addFood(idnum, name) {
    setFoods([
      ...foods,
      {id:foodID++, food_id:idnum, food_name:name}
    ]);
    setFoodResults([]);
    setSearchInput("");
  }
  */

  function deleteFood(id){
    setFoods(
      foods.filter(food => food.id !== id)
    );
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
      <button onClick={handleDelete}>Delete meal</button>
      <ul>
        {foods.map(
          food => (
            <Food key={food.id} name={food.food_name} delete={deleteFood} />
          )
        )}
      </ul>
      <input value={searchInput} onChange={e => search(e.target.value)}></input>
      <ul id={hideResults}>
        {foodResults.map(
          food =>
          (<SearchResult key={searchID++} food_name={food.food_name} brand_name={food.brand_name} food_id={food.food_id} select={selectResult}/>)
        )}
      </ul>
    </div>
  )
}

const FoodLog = () => {
  const [mealname, setMealname] = useState('');
  const [meals, setMeals] = useState([]);

  //addMeal and deleteMeal use standard array functions to add to or remove from a single meal to the meals state array.
  function addMeal() {
    if(meals.some(meal => meal.name === mealname)) {
      alert("Each meal must have its own name.")
    } else(
      setMeals([
        ...meals,
        { id:mealID++, name:mealname}
      ])
    );
  }

  function deleteMeal(name){
    setMeals(
      meals.filter(meal => meal.name !== name)
    );
  }
  
  //Returns html forms that create meal components.
  //The meal components are returned in an unordered list.
  //Meal components are created by iterating through the meals state array.
  return (
    <div className="log">
      <input value={mealname} onChange={e => setMealname(e.target.value)}></input>
      <button onClick={addMeal}>Add meal</button>
      <ul>
        {meals.map(
          meal => (
            <Meal className="meal" key={meal.id} name={meal.name} delete={deleteMeal} />
          )
        )}
      </ul>
    </div>
  )
}

export default FoodLog