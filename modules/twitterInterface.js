const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

const configJSON = JSON.parse(fs.readFileSync('./config.json'));

/**
 * Saves tweet information to json file
 * 
 * @param  {Object} data
 * @param  {String} data.msg
 * @param  {Array} data.imageNames
 * @param  {Number} data.id
 */
const saveTweetObj = (data) => {
    const jsonFileName = path.join(__dirname, 'previousTweets.json');
    let json = {};
    try {
        const jsonText = fs.readFileSync(jsonFileName);
        json = JSON.parse(jsonText);
    } catch (_) {} finally {
        json[data.id] = data;
        const newJsonText = JSON.stringify(json);
        fs.writeFileSync(jsonFileName, newJsonText);
    }
};
/**
 * Post tweets without saving the output
 * 
 * @param  {String} msg=undefined
 * @param  {Array} imageNames=undefined
 */
const postTweetRaw = async (msg = undefined, imageNames = undefined) => {
    if (msg === undefined && imageNames === undefined) {
        throw new Error('You must enter either a message or a list of image names')
    }
    const client = new TwitterApi(configJSON);

    let mediaIds = [];
    if (Array.isArray(imageNames)) {
        mediaIds = await Promise.all(imageNames.map((name) => {
            return client.v1.uploadMedia(name);
        }));
    }
    
    const res = await client.v1.tweet(msg, { media_ids: mediaIds })    
    console.log(res);
    return res;
}
/**
 * Posts tweets and saves the id to a json file to allow for deletion
 * 
 * @param  {String} msg=''
 * @param  {List} imageNames=[]
 */
const postTweet = async (msg = undefined, imageNames = undefined) => {
    const res = await postTweetRaw(msg, imageNames);
    const id = res.id;
    console.log(res);
    const saveObj = { msg, imageNames, id };
    saveTweetObj(saveObj);
    return res;
}

const deleteTweet = async (id) => {

}

module.exports =  {
    postTweet, 
}