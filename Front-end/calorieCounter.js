var numberofMeals = 0;
const socket = new WebSocket('ws://localhost:8080');
socket.binaryType = "arraybuffer";


socket.addEventListener('open', event =>{
    console.log("Socket connection open.")
});

socket.addEventListener('message', event => {
  console.log('Message from server: ', event.data);
  if(event.data.slice(0,"SEARCH_RESULTS:".length)=="SEARCH_RESULTS:"){
    searchResults = JSON.parse(event.data.slice("SEARCH_RESULTS:".length,event.data.length));
    console.log(searchResults);
  };
  
});

function openMealAdd()
{
    document.getElementById("addMeal").style.display="flex";
    document.getElementById("meal-input").style.display="block";
}

function closeMealAdd()
{   
    numberofMeals++;
    var mealName = document.getElementById("mealName").value;
    if (mealName=="") {mealName="Undefined";};
    document.getElementById("mealName").value = "";
    const listItem = document.createElement("li");
    listItem.id = "meal" + numberofMeals;
    const section = document.createElement("section");
    section.className = "meal";
    const firstFrame = document.createElement("div");
    const mealNameCont = document.createElement("h3");
    mealNameCont.innerHTML = mealName;
    firstFrame.className = "frame3";
    firstFrame.appendChild(mealNameCont);
    const mealDeleteButton = document.createElement("button");
    mealDeleteButton.className = "mealDeleteButton";
    mealDeleteButton.addEventListener("click", (event) => {deleteMeal(listItem.id)});
    mealDeleteButton.innerHTML = "&#10006";
    firstFrame.appendChild(mealDeleteButton);
    const secondFrame = document.createElement("div");
    secondFrame.className = "frame2";
    secondFrame.id = listItem.id+"-food-frame";
    const foodAddButton = document.createElement("button");
    foodAddButton.className = "add-food";
    foodAddButton.append(document.createElement("b"));
    foodAddButton.firstChild.innerHTML = "Add food";
    foodAddButton.id = secondFrame.id +"button";
    foodAddButton.addEventListener( "click", (event) => {addFood(foodAddButton.id)});

    document.getElementById("addMeal").style.display="none";
    document.getElementById("meal-input").style.display="none";

    document.getElementById("meal-list").insertAdjacentElement("beforeend",listItem);
    listItem.append(section);
    section.append(firstFrame);
    section.append(secondFrame); 
    secondFrame.append(document.createElement("br"));
    secondFrame.append(foodAddButton);
    secondFrame.append(document.createElement("br"));
}

function deleteMeal(mealID)
{
    const listItem = document.getElementById(mealID).remove();
    
}

function addFood(buttonID)
{
    document.getElementById("addFood").style.display="flex";
    document.getElementById("food-input").style.display="block";
}

async function foodSearch(accessToken){
    var foodName = document.getElementById("foodName").value;
    socket.send("Food_name="+foodName);
}


function appendToMeal(buttonID, foodInfo){
    const foodCont = document.createElement("div");
    const foodNameCont = document.createElement("div");
    foodNameCont.className = "food-name";
    foodNameCont.innerHTML = "Sample food";
    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.innerHTML = "✎";
    const foodDetails = document.createElement("div");
    foodDetails.className = "food-details";
    foodDetails.innerHTML = "1 Cup<br/>500 Calories";

    document.getElementById(buttonID).before(foodCont);
    foodCont.append(foodNameCont);
    foodCont.append(editButton);
    foodCont.append(foodDetails);
}