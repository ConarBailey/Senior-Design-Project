    
    var numberofMeals = 0;
    
    function openMealAdd()
    {
	document.getElementById("add").style.display="flex";
        document.getElementById("meal-input").style.display="block";
    }

    function closeMealAdd()
    {   
        numberofMeals++;
        var mealName = document.getElementById("mealName").value;
        document.getElementById("mealName").value = "";
        const listItem = document.createElement("li");
        listItem.id = "meal" + numberofMeals;
        const section = document.createElement("section");
        section.className = "meal";
        const firstFrame = document.createElement("div");
        const mealNameCont = document.createElement("h3");
        mealNameCont.innerHTML = mealName;
        firstFrame.className = "frame3";
        firstFrame.appendChild(document.createElement("br"));
        firstFrame.appendChild(mealNameCont);
        const secondFrame = document.createElement("div");
        secondFrame.className = "frame2";
        const foodNameCont = document.createElement("div");
        foodNameCont.className = "food-name";
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.innerHTML = "✎";

        document.getElementById("add").style.display="none";
        document.getElementById("meal-input").style.display="none";

        document.getElementById("meal-list").insertAdjacentElement("beforeend",listItem);
        listItem.append(section);
        section.append(firstFrame);
        section.append(secondFrame); 
        
    }
