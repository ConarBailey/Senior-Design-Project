const apiURL = 'https://platform.fatsecret.com/rest/server.api';

const getToken = require("./getAccessToken")
const foodid = process.argv[2] ? process.argv[2] : '70829266';
async function callFatSecretApi(accessToken) {
    const apiParams = new URLSearchParams();
    apiParams.append('method', 'food.get.v5');
    apiParams.append('food_id', foodid); 
    apiParams.append('format', 'json'); 

    try {
        const response = await fetch(apiURL + '?' + apiParams.toString(), {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.food);
        console.log(data.food.servings.serving[0]);

    } catch (error) {
        console.error('Error calling FatSecret API:', error);
    }
}

(async () => {
    const token = await getToken.getAccessToken();
    // console.log(token)
    if (token) {
        await callFatSecretApi(token);
    }
})();
