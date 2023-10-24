const SpotifyWebApi = require('spotify-web-api-node')
const {Telegraf} = require('telegraf')
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

bot.on('audio',  (ctx) => {
//    ctx.reply(ctx.update.message.audio)
    console.log(ctx.update.message.audio)
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);

            let message = ''
            spotifyApi.searchTracks(ctx.update.message.audio.title, {limit: 3})
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
