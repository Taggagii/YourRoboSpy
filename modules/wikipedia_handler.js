const wiki = require('wikipedia');
const path = require('path');

let names = ["Joe Rogan", "Joseph Stalin"]

module.exports = {
    genName: async () => {
        //const subj_path = path.join(__dirname, 'subjects.json')
        namelist = JSON.parse(fs.readFileSync('./subjects.json'));
        indices = Object.keys(namelist)
        console.log(indices)
        //subjNameIndex = indices[Math.floor(Math.random() * indices.length)]

    },

    getSubjectName: async (subjectName) => {
	try {
		const page = await wiki.page('Batman');
		console.log(page);
		//Response of type @Page object
		const summary = await page.summary();
		console.log(summary);
		//Response of type @wikiSummary - contains the intro and the main image
	} catch (error) {
		console.log(error);
		//=> Typeof wikiError
	}
}
};