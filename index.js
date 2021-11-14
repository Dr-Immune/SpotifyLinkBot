const SpotifyWebApi = require('spotify-web-api-node')
const {Telegraf} = require('telegraf')
const express = require('express');
const config = require('./config/default.json')
const app = express();

const bot = new Telegraf(config.telegram.bot_token)

const spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.client_id,
    clientSecret: config.spotify.client_secret
});

bot.on('audio',  (ctx) => {
    ctx.reply(ctx.update.message.audio)
    console.log(ctx.update.message.audio)
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);

            let message = ''
            spotifyApi.searchTracks(ctx.update.message.audio.title, {limit: 5})
                .then((data) => {
                    for (let i=0;i<data.body.tracks.items.length; i++) {
                        message += 'Name: ' + data.body.tracks.items[i].name + '\n'
                        message += 'Artist: ' + data.body.tracks.items[i].artists[0].name + '\n'
                        message += 'Album: ' + data.body.tracks.items[i].album.name + '\n'
                        message += 'Release Date: ' + data.body.tracks.items[i].album.release_date + '\n'
                        message += 'Duration: ' + millisToMinutesAndSeconds(data.body.tracks.items[i].duration_ms) + '\n'
                        message += data.body.tracks.items[i].external_urls.spotify + '\n'
                        message += '---------------------------------------' + '\n'
                    }
                    // console.log(message)
                    if (message === '')
                        ctx.reply('no result')
                    else
                        ctx.reply(message)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        function(err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
})

function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

bot.launch().then(() => {
    console.log('bot started to work')
})

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
