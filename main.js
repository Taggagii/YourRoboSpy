const twitterInterface = require("./modules/twitterInterface.js");
const textGen = require("./modules/textGen");
const wiki = require("./modules/wikipedia_handler")
const fs = require('fs');
const configJSON = JSON.parse(fs.readFileSync('./config.json')).twitter;
console.log(configJSON);

const MS_IN_DAY = 1000*60*60*24;

// five minutes
const MS_REPLY_DELAY = 2;

//const getSubjectName = (i) => "Karl Marx";
//const getWikiDesc = () => "Karl Marx was a German philosopher, economist, historian, sociologist, political theorist, journalist, critic of political economy, and socialist revolutionary. His best-known titles are the 1848 pamphlet The Communist Manifesto and the four-volume Das Kapital (1867–1883). Marx's political and philosophical thought had enormous influence on subsequent intellectual, economic, and political history. His name has been used as an adjective, a noun, and a school of social theory.";

const generateInitPost = (subjName, subjDesc) => `My name is ${subjName}. ${subjDesc}\n Ask me anything!`;

const sleep = async (s) => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve();
      }, s * 1000);
  });
};

let answeredQuestionIds = []

const selectQuestion = (replies) => {
  console.log('SELECTING A REPLY');
  for (let i = 0; i < replies?.data?.length ?? 0; ++i) {
    const element = replies.data[i];
    if (!answeredQuestionIds.includes(element.id) && element.text.startsWith(`@${configJSON.accountUsername}`)) {
      answeredQuestionIds.push(element.id)
      return element
    }
  }
  throw new Error("No new questions available")
};

const main = async () => {
  while (true) {
    const subjName = await wiki.getSubjectName();
    const subjDesc = await wiki.getWikiDesc(subjName);
    
    const initPost = generateInitPost(subjName, subjDesc);
    console.log('Initial Post')
    console.log(initPost)

    // todo : (sprinkle) also send cover image at start
    const replier = await twitterInterface.getReplier(initPost);
    // const replier = await twitterInterface.buildReplier('1591577673712766976');

    console.log({replier})
    const start = new Date();
    
    // keep this subject for a day
    while (new Date() - start < MS_IN_DAY) {
			await sleep(MS_REPLY_DELAY); // todo : uncomment

      const replies = await replier.getReplies(); 

      // TODO add proper selection logic for tweets
      // don't reply to same tweet many times
      // choose best reply on some criteria
      let selectedQuestion;
      try {
        selectedQuestion = selectQuestion(replies);
      } catch (err) {
        if (err.message === "No new questions available") {
          console.log('No replies yet!');
          continue;
        }
        throw err;
      }
      console.log('selected question');
      console.log(selectedQuestion);

			// call openai stuff to generate reply
			const replyText = await textGen.generateAnswer(subjDesc, subjName, selectedQuestion.text);
      console.log('reply text');
      console.log(replyText);
			
			// respond with reply
      const replyResp = await twitterInterface.replyTo(replyText, selectedQuestion.id);
    }

    subjIdx += 1;
  }
}

main();
