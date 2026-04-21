const apiURL = 'https://platform.fatsecret.com/rest/server.api';

async function getFoodName(accessToken,foodName) {
    const apiParams = new URLSearchParams();
    apiParams.append('method', 'foods.search');
    apiParams.append('search_expression', foodName); 
    apiParams.append('max_results', '20');
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
        return data;
    } catch (error) {
        console.error('Error calling FatSecret API:', error);
    }
}



module.exports = {
    getFoodName
}