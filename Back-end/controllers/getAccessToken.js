const fetch = require('node-fetch').default;
const clientId = 'a91a5282b734407c8cd650cf32e66b1d'
const clientSecret = 'd566ba945d034d758dd4b858e00bf1f3'
const tokenUrl = 'https://oauth.fatsecret.com/connect/token';

async function getAccessToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'basic');

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // jsonString = JSON.stringify(data);
        // console.log('Access Token Data:', jsonString);
        // console.log('Access Token Data:', data);
        return data.access_token; 
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}

module.exports = {
  getAccessToken
};