const openai = require("../local-modules/openai/openaiLocal");

const generateLevelTest = async (subject, theme) => {
  const prompt = `Genere un fichier json bien formatté listant une serie de 7 questions avec ses reponses, tel un quizz sur le coté pratique concernant la matiere ${subject} sur le theme ${theme}. Le format devrait etre comme suit : { datas:[ { question: "la question est ici", choix: [ "choix1", "choix2", "choix3", "choix4" ], idReponse: indice de la bonne reponse dans le tableau choix }, ] } Exactement 1 seul choix est correct dans le tableau de choix, et l'indice de son emplacement dans le tableau est figuré dans le champs idReponse Par exemple , si l'objet est : { datas:[ { question: "la question est ici", choix: [ "choix1", "choix2", "choix3", "choix4" ], idReponse: 2 } ] } Cela signifierai que "choix3" soit la bonne reponse car dans le tableau choix , il a l'indice 2, qui est ensuite mentionné dans le champs idReponse, qui est également à son tour 2 Un seul choix doit etre la vrai reponse. Fait en sorte que la reponse soit reellement correct.`;
  try {
    const completions = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 3000,
    });
    const levelTest = JSON.parse(completions.data.choices[0].text);
    return levelTest;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  generateLevelTest,
};
