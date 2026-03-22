const apiURL = 'https://platform.fatsecret.com/rest/server.api';

async function callFatSecretAPI(accessToken,foodName) {
    const apiParams = new URLSearchParams();
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
        let total_results = data.foods.total_results;
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