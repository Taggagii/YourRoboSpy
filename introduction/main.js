const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');

const configJSON = JSON.parse(fs.readFileSync('./config.json'));

const postTweet = async (msg, imageNames) => {
    const client = new TwitterApi(configJSON);

    const mediaIds = await Promise.all(imageNames.map((name) => {
        client.v1.uploadMedia(name);
    }));
    
    client.v1.tweet(msg, { media_ids: mediaIds })    
}
