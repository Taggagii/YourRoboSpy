const text_gen = require('./text_gen');

const test = async () => {
  const res = await text_gen.generateAnswer(
    context=`Freddie was a British singer and songwriter who achieved worldwide fame as the lead vocalist of the rock band Queen.
    Freddie defied the conventions of a rock frontman with his theatrical style, influencing the artistic direction of Queen.`,
    subjName="Freddie Mercury",
    question="Do you wish you never became famous?"
  );

  console.log(res);
}

test();
