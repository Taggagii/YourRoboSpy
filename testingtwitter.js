const twitterInterface = require('./modules/twitterInterface')

const sleep = async (s) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    });
};

// const tester = async () => {
//     // const replier = await twitterInterface.buildReplier('1591551546621186048');
//     const replier = await twitterInterface.getReplier('testing' + Math.random());
//     // console.log(replier);
//     // const replies = await replier.getReplies();
//     for (let i = 0; i < 100; ++i) {
//         console.log('data');
//         const replies = await replier.getReplies();
//         console.log(replies);
//         await sleep(5);
//     }
    
//     // const replies = await twitterInterface.getReplies({tid: replier.tid})
// };

// tester();

console.log(twitterInterface.getAuthorId())