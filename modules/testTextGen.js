const textGen = require('./textGen');

const test = async () => {
  const res = await textGen.generateAnswer(
    subjName="Elon Musk",
    context=`Elon is a business magnate and investor. He is the founder, CEO, and chief engineer of SpaceX; angel investor, CEO and product architect of Tesla, Inc.; founder of the Boring Company; co-founder of Neuralink and OpenAI; president of the Musk Foundation; and owner and CEO of Twitter, Inc. With an estimated net worth of around $174 billion as of November 11, 2022, Musk is the wealthiest person in the world according to the Bloomberg Billionaires Index and Forbes's real-time billionaires list.`,
    question="Why do you do business with Chinese government even though they hurt so many people?",
  );

  console.log(res);
}

test();
