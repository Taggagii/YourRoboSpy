const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { config } = require('process');

const configJSON = JSON.parse(fs.readFileSync('./config.json')).twitter;
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

/**
 * Replys with `replyText` to a given twitter id
 * 
 * @param  {String} replyText
 * @param  {String} tid
 */
const replyTo = async (replyText, tid) => {
    const res = client.v1.reply(replyText, tid);
    return res;
}

/**
 * Get's conversationId for a given twitter id 
 * 
 * @param  {string} tid
 */
const getConversation = async (tid) => {
    const res = await axios.get(`https://api.twitter.com/2/tweets?ids=${tid}&tweet.fields=conversation_id`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getBearer()}`
        }
    });
    if (res.status === 200) {
        return res.data?.data[0]?.conversation_id;
    } else {
        return TWITTERINTERFACEERRORMSG;
    }
};

/**
 * Get's replies for a given twitter id
 * 
 * @param  {Object} values
 * @param  {String} values.tid - optional
 * @param  {String} values.conversationId - optional
 */
const getReplies = async (values) => {
    let conversationId;
    if (values.hasOwnProperty('conversationId')) {
        ({ conversationId } = values);
    } else {
        conversationId = await getConversation(tid);
    }

    const res = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${conversationId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getBearer()}`,
        }
    });
    if (res.status === 200) {
        return res.data;
    } else {
        return TWITTERINTERFACEERRORMSG;
    }
}

const buildReplier = async (tid) => {
    const conversationId = await getConversation(tid);
    const outputObj = {
        conversationId,
        tid,
        text: "something dunno",
        getReplies: async () => {
            const res = await getReplies({ conversationId });
            return res;
        }
    }
    
    return outputObj;
}

const getReplier = async (msg, imageNames) => {
    const res = await postTweet(msg, imageNames);
    const tid = res.id;
    const conversationId = await getConversation(tid);
    const outputObj = {
        conversationId,
        tid,
        text: res.full_text,
        getReplies: async () => {
            const res = await getReplies({ conversationId });
            return res;
        }
    }
}



module.exports =  {
    postTweet, 
    deleteTweet,
    getReplies,
    getTweet,
    replyTo,
    getReplier,
    buildReplier,
}