const apiURL = 'https://platform.fatsecret.com/rest/server.api';

const getToken = require("./getAccessToken")

async function callFatSecretAPI(accessToken,foodName) {
    const apiParams = new URLSearchParams();
    // apiParams.append('method', 'food.get');
    // apiParams.append('food_id', '70829266'); 
    apiParams.append('method', 'foods.search');
    apiParams.append('search_expression', foodName); 
    apiParams.append('max_results', '10');
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

        let data = await response.json();
        //console.log(data)
        let total_results = data.foods.total_results;
        // console.log('Total results=',total_results);
        // const jsonString = JSON.stringify(data)
        // console.log('API Response Data:', jsonString);
        if (total_results != '0') {
            
            return data;
        }
        else {
            console.log('Error: '+foodName+' not found.')
        }

    } catch (error) {
        console.error('Error calling FatSecret API:', error);
    }
}



module.exports = {
    callFatSecretAPI
}