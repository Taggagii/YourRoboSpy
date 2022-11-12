const twitterInterface = require("./modules/twitterInterface.js");
const textGen = require("./modules/textGen");
const wiki = require("./modules/wikipedia_handler")


const MS_IN_DAY = 1000*60*60*24;

// five minutes
const MS_REPLY_DELAY = 1000*60*2;

//const getSubjectName = (i) => "Karl Marx";
//const getWikiDesc = () => "Karl Marx was a German philosopher, economist, historian, sociologist, political theorist, journalist, critic of political economy, and socialist revolutionary. His best-known titles are the 1848 pamphlet The Communist Manifesto and the four-volume Das Kapital (1867–1883). Marx's political and philosophical thought had enormous influence on subsequent intellectual, economic, and political history. His name has been used as an adjective, a noun, and a school of social theory.";

const generateInitPost = (subjName, subjDesc) => `My name is ${subjName}. ${subjDesc}\n Ask me anything!`;

const selectQuestion = (replies) => replies[0];


const main = async () => {

  while (true) {
    const subjName = wiki.getSubjectName();
    const subjDesc = wiki.getWikiDesc(subjName);
    
    const initPost = generateInitPost(subjName, subjDesc);

    // TODO SPRINKLE also send cover image at start
    const res = await twitterInterface.postTweet(initPost);

    const start = new Date();
    
    // keep this subject for a day
    while (new Date() - start < MS_IN_DAY) {
			await sleep(MS_REPLY_DELAY);

			// TODO is this the corret twitter id we are passing
      const replies = await twitterInterface.getReplies(res.id);

      // TODO add proper selection logic for tweets
      // don't reply to same tweet many times
      // choose best reply on some criteria
      const selectedQuestion = selectQuestion(replies);

			// call openai stuff to generate reply
			const replyText = textGen.generateAnswer(
				subjName=subjName,
				context=desc,
				// TODO Is this the proper way to extract selected question text
				question=selectedQuestion.text,
			);
			
			// respond with reply
      const replyResp = await twitterInterface.replyTo(
				replyText,
				// TODO is this how to get id of question we are replying to
				selectedQuestion.id
			);
    }

    subjIdx += 1;
  }
}

main();
