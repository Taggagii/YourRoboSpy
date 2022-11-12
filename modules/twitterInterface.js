const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { config } = require('process');

const configJSON = JSON.parse(fs.readFileSync('./config.json'));
const jsonFileName = path.join(__dirname, 'previousTweets.json');

const client = new TwitterApi(configJSON);

const TWITTERINTERFACEERRORMSG = '|||PROBLEM TWITTERINTERFACE|||';

/**
 * gets recent tweets from json file
 */
const getRecentTweets = () => {
    let json = {};
    try {
        const jsonText = fs.readFileSync(jsonFileName);
        json = JSON.parse(jsonText);
    } catch (_) {} finally {
        return json;
    }
};

/**
 * Saves tweet information to json file
 * 
 * @param  {Object} data
 * @param  {String} data.msg
 * @param  {Array} data.imageNames
 * @param  {String} data.id
 */
const saveTweetObj = (data) => {
    const json = getRecentTweets();
    json[data.id] = data;
    const newJsonText = JSON.stringify(json);
    fs.writeFileSync(jsonFileName, newJsonText);
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

    let mediaIds = [];
    if (Array.isArray(imageNames)) {
        mediaIds = await Promise.all(imageNames.map((name) => {
            return client.v1.uploadMedia(name);
        }));
    }
    
    const res = await client.v1.tweet(msg, { media_ids: mediaIds })    
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
    const saveObj = { msg, imageNames, id };
    saveTweetObj(saveObj);
    return res;
}

/**
 * Deletes a tweet for a specified tweet id
 * 
 * @param  {String} id
 */
const deleteTweet = async (id) => {
    const deletedTweet = await client.v1.deleteTweet(id);
    return deletedTweet;
}


/**
 * Get's Bearer token for a user
 * 
 */
const getBearer = async () => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    const res = await axios.post('https://api.twitter.com/oauth2/token', params, {
        auth: {
            username: configJSON.appKey,
            password: configJSON.appSecret,
        }
    });
    if (res ?? res.status === 200) {
        return res?.data?.access_token;
    } else {
        throw new Error("Couldn't get Bearer token");
    }
}

/**
 * Get's tweet by id
 * 
 * @param  {String} id
 */
const getTweet = async (id) => {
    const res = await client.v1.singleTweet(id);
    return res;
}


const replyTo = async (replyText, id) => {
    const res = client.v1.reply(replyText, id);
    return res;
}


const getConversation = async (tid) => {
    const res = await axios.get(`https://api.twitter.com/2/tweets?ids=${tid}&tweet.fields=author_id,conversation_id,created_at,in_reply_to_user_id,referenced_tweets&expansions=author_id,in_reply_to_user_id,referenced_tweets.id&user.fields=name,username`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getBearer()}`
        }
    });
    if (res.status === 200) {
        return res.data;
    } else {
        return TWITTERINTERFACEERRORMSG;
    }
};


/**
 * Get's replys for a specified tweet id
 * 
 * @param  {String} id
 */
 const getReplys = async (id) => {
    console.log(id);
}

module.exports =  {
    postTweet, 
    deleteTweet,
    saveTweetObj,
    getRecentTweets, 
    getReplys,
    getTweet,
    replyTo,
    getConversation,
}