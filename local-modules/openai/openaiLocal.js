const { Configuration, OpenAIApi } = require("openai");

const { api_key } = require("../../config");
const configuration = new Configuration({
    apiKey: api_key,
  });

const openaiLocal = new OpenAIApi(configuration);

module.exports = openaiLocal