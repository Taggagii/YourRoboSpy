const twitterInterface = require("./modules/twitterInterface.js");

// twitterInterface.postTweet('he sighs and then walks home to the other world that is a thing');
// console.log(twitterInterface.getRecentTweets());
// const tid = 1591457123275243500;

// twitterInterface.getReplys(tid);

// twitterInterface.postTweet('testing things')

// console.log(twitterInterface.buildAuthHeader())
// twitterInterface.printTweet();

// const tid = 1591463308758220801;
const tid = "1591467058188980224";

const letThing = async () => {
  // console.log(await twitterInterface.getBearer());
  // console.log(await twitterInterface.getTweet(tid));
  console.log(await twitterInterface.getReplies(tid));
  // await twitterInterface.replyTo('tesitng reply', tid);
};

letThing();
