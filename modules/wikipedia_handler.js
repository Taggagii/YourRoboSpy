const wiki = require('wikipedia');
const path = require('path');

let names = ["Joe Rogan", "Joseph Stalin"]

module.exports = {
    getSubjectName: async () => {
        //const subj_path = path.join(__dirname, 'subjects.json')
        //namelist = JSON.parse(fs.readFileSync('./subjects.json'));
        //indices = Object.keys(namelist)
        //subjNameIndex = indices[Math.floor(Math.random() * indices.length)]
        const subjName = names[Math.floor(Math.random() * names.length)]
        console.log(subjName)
        return subjName
    },

    getWikiDesc: async (subjectName) => {
	try {
		const page = await wiki.page(subjectName);
		//console.log(page);
		//Response of type @Page object
		const summary = await page.summary();
		console.log(summary.extract);
        return summary.extract
		//Response of type @wikiSummary - contains the intro and the main image
	} catch (error) {
		console.log(error);
		//=> Typeof wikiError
	}
}
};