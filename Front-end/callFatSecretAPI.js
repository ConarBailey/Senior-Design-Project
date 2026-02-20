const apiURL = 'https://platform.fatsecret.com/rest/server.api';

const getToken = require("./getAccessToken")
const foodName = process.argv[2] ? process.argv[2] : 'apple';

async function callFatSecretApi(accessToken) {
    const apiParams = new URLSearchParams();
    // apiParams.append('method', 'food.get');
    // apiParams.append('food_id', '70829266'); 
    apiParams.append('method', 'foods.search');
    apiParams.append('search_expression', foodName); 
    apiParams.append('max_results', '2');
    apiParams.append('format', 'json'); 

    try {
        const response = await fetch(apiURL + '?' + apiParams.toString(), {
            method: 'POST', // Method can also be POST
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data)
        const total_results = data.foods.total_results;
        // console.log('Total results=',total_results);
        // const jsonString = JSON.stringify(data)
        // console.log('API Response Data:', jsonString);
        if (total_results != '0') {
            const formattedResults = data.foods.food.map(food => {
                // The food_description usually looks like: "Per 100g - Calories: 52kcal | Fat: 0.17g..."
                const description = food.food_description;
                
                // Extract calories using regex (find digits before "kcal")
                const calorieMatch = description.match(/Calories: (\d+)kcal/);
                const calories = calorieMatch ? calorieMatch[1] : 'N/A';

                return {
                food_id: food.food_id,
                food_name: food.food_name,
                calories: calories // Extracted from description
                };
            });
            console.log(formattedResults)
        }
        else {
            console.log('Error: '+foodName+' not found.')
        }

    } catch (error) {
        console.error('Error calling FatSecret API:', error);
    }
}

(async () => {
    const token = await getToken.getAccessToken();
    
    if (token) {
        await callFatSecretApi(token);
    }
})();
