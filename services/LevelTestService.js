const openai = require("../local-modules/openai/openaiLocal");

const generateLevelTest = async (subject, theme) => {
  const prompt = `Genere un fichier json bien formatté en une ligne , listant une serie de 5 questions avec ses reponses, tel un quizz sur le coté pratique concernant la matiere ${subject} sur le theme ${theme}. Le format devrait etre comme suit : { "datas":[ { "question": "la question est ici", "choix": [ "choix1", "choix2", "choix3" ], "idReponse": indice de la bonne reponse dans le tableau choix }, ] }`;
  try {
    const completions = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 2000,
    });

    console.log(completions.data.choices[0].text) 
    const levelTest = JSON.parse(completions.data.choices[0].text.trim());
    return levelTest;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  generateLevelTest,
};
