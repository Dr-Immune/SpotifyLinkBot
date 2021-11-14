const  request = require('request'); // "Request" library

const client_id = '28a702063ba3414eafc77ff7dfeb8e96'; // Your client id
const client_secret = 'ca266714ea794b1d9c47892e5822af6d'; // Your secret

// your application requests authorization
let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        let token = body.access_token;
        console.log(token)
        let options = {
            url: 'https://api.spotify.com/v1/users/alone_in_dark110',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        request.get(options, function(error, response, body) {
            console.log(body);
        });
    }
});