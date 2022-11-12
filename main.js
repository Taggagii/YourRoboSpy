const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');

const configJSON = JSON.parse(fs.readFileSync('./config.json'));

const makeRequest = async () => {
    const client = new TwitterApi(configJSON);

    const mediaIds = await Promise.all([
        client.v1.uploadMedia('./tiger.png'),
        client.v1.uploadMedia('./tiger2.png'),
    ]);
    

    client.v1.tweet('stupid things in the world now that things are to be', { media_ids: mediaIds })
    

    
}

makeRequest();