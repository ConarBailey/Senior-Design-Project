const getToken = require("./getAccessToken")
const getFoodName = require("./getFoodName")
const apiURL = 'https://platform.fatsecret.com/rest/server.api';
// const { json } = require("express");



async function getFoodId(accessToken,foodId) {
    const apiParams = new URLSearchParams();
    apiParams.append('method', 'food.get.v5');
    apiParams.append('food_id', foodId); 
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
        return data
    } catch (error) {
        console.error('Error calling FatSecret API:', error);
        return None;
    }
}

const handleCallFatSecretAPI = async (req, res) => {
    const {foodId, foodName} = req.body;
    if (!foodId && !foodName) return res.status(400).json({'message' : 'Either foodId or foodName is required'});
    try {
        const token = await getToken.getAccessToken();
        if (token) {
            if (foodId) {
                const data = await getFoodId(token,foodId);
                if (data) {
                    res.json(data);
                    // console.log(JSON.stringify(data))
                }
            }
            else if (foodName) {
                const data = await getFoodName.getFoodName(token,foodName);
                if (data) {
                    res.json(data);
                    // console.log(JSON.stringify(data))
                }               
            }
            else {
                res.status(502).json({'error' : 'Failed to get data from FatSecret.'});
            }
        }
        else {
            res.status(502).json({'error' : 'Failed to get access token from FatSecret.'});
        }
    } catch (error) {
        console.error('Error calling FatSecret API',error);
    }
}

module.exports = { handleCallFatSecretAPI }