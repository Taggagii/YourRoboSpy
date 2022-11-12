const twitterInterface = require("./modules/twitterInterface");


async function tester() {
    const res = await twitterInterface.getReplyStream(tid);
    console.log(res);
}

tester();
