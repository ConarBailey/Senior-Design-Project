const apiURL = 'https://platform.fatsecret.com/rest/server.api';

const getToken = require("./getAccessToken")
async function callFatSecretAPI(accessToken,foodid) {
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
        return data;

    } catch (error) {
        console.error('Error calling FatSecret API:', error);
    }
}

(async () => {
    const token = await getToken.getAccessToken();
    // console.log(token)
    if (token) {
        await callFatSecretAPI(token);
    }
})();

module.exports = {
    callFatSecretAPI
}