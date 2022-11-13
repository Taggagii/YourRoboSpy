const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');

const configJSON = JSON.parse(fs.readFileSync('./config.json')).openai;

const configuration = new Configuration({
  apiKey: configJSON.apiKey,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  generateAnswer: async (context, subjName, question) => {
    const prompt = `
    The following is a conversation with ${subjName}.
    ${context}
    
    Question: ${question}
    
    ${subjName}:
    `;
    // TODO add checks for prompt injection in prompt
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      temperature: 1,
      max_tokens: 50
    });
    return completion.data.choices[0].text;
  }
};
