const wiki = require('wikipedia');
const path = require('path');

let names = ['Jesus', 'Napoleon', 'Muhammad', 'William Shakespeare', 'Abraham Lincoln', 'George Washington', 'Adolf Hitler', 'Aristotle', 'Alexander the Great', 'Thomas Jefferson', 'Henry VIII of England', 'Charles Darwin', 'Elizabeth I of England', 'Karl Marx', 'Julius Caesar', 'Queen Victoria', 'Martin Luther', 'Joseph Stalin', 'Albert Einstein', 'Christopher Columbus', 'Isaac Newton', 'Charlemagne', 'Theodore Roosevelt', 'Wolfgang Amadeus Mozart', 'Plato', 'Louis XIV of France', 'Ludwig van Beethoven', 'Ulysses S. Grant', 'Leonardo da Vinci', 'Augustus', 'Carl Linnaeus', 'Ronald Reagan', 'Charles Dickens', 'Paul the Apostle', 'Benjamin Franklin', 'George W. Bush', 'Winston Churchill', 'Genghis Khan', 'Charles I of England', 'Thomas Edison', 'James I of England', 'Friedrich Nietzsche', 'Franklin D. Roosevelt', 'Sigmund Freud', 'Alexander Hamilton', 'Mohandas Karamchand Gandhi', 'Woodrow Wilson', 'Johann Sebastian Bach', 'Galileo Galilei', 'Oliver Cromwell', 'James Madison', 'Gautama Buddha', 'Mark Twain', 'Edgar Allan Poe', 'Joseph Smith, Jr.', 'Adam Smith', 'David, King of Israel', 'George III of the United Kingdom', 'Immanuel Kant', 'James Cook', 'John Adams', 'Richard Wagner', 'Pyotr Ilyich Tchaikovsky', 'Voltaire', 'Saint Peter', 'Andrew Jackson', 'Constantine the Great', 'Socrates', 'Elvis Presley', 'William the Conqueror', 'John F. Kennedy', 'Augustine of Hippo', 'Vincent van Gogh', 'Nicolaus Copernicus', 'Vladimir Lenin', 'Robert E. Lee', 'Oscar Wilde', 'Charles II of England', 'Cicero', 'Jean-Jacques Rousseau', 'Francis Bacon', 'Richard Nixon', 'Louis XVI of France', 'Charles V, Holy Roman Emperor', 'King Arthur', 'Michelangelo', 'Philip II of Spain', 'Johann Wolfgang von Goethe', 'Ali, founder of Sufism', 'Thomas Aquinas', 'Pope John Paul II', 'René Descartes', 'Nikola Tesla', 'Harry S. Truman', 'Joan of Arc', 'Dante Alighieri', 'Otto von Bismarck', 'Grover Cleveland', 'John Calvin', 'John Locke']

module.exports = {
    getSubjectName: async () => {
        const subjName = names[Math.floor(Math.random() * names.length)]
        //console.log(subjName)
        return subjName
    },

    getWikiDesc: async (subjectName) => {
	try {
		const page = await wiki.page(subjectName);
		// Response of type @Page object
		const summary = await page.summary();
		//console.log(summary.extract);
		const sentences = summary.extract.split(".")
        return sentences[0]+" "+sentences[2]
		//Response of type @wikiSummary - contains the intro and the main image
	} catch (error) {
		console.log(error);
		// => Typeof wikiError
	}
}
};