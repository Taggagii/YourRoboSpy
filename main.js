//const twitterInterface = require('./modules/twitterInterface.js');


//twitterInterface.postTweet('he sighs and then walks home to the other world that is a thing', ['./tiger.png']);


const wiki = require('wikipedia');

(async () => {
	try {
		const page = await wiki.page('Joe Rogan');
		//console.log(page);
		//Response of type @Page object
		const summary = await page.summary();
		//console.log(summary);
        console.log(summary?.extract)
		//Response of type @wikiSummary - contains the intro and the main image
	} catch (error) {
		console.log(error);
		//=> Typeof wikiError
	}
})();
