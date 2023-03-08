const { api_key } = require("../config");
const openai = require("../local-modules/openai/openaiLocal");

const generateLevelTest = async (subject, theme) => {
  const prompt = `
    Sans mettre aucune introduction ni conclusion dans ta reponse,
    genere un fichier json bien formatté listant une serie de 10 questions
    reponses, tel un quizz concernant la matiere ${subject} sur le theme ${theme}.
    Le format devrait etre comme suit :
    {
       datas:[
         {
           question: "la question est ici",
           choix: [
            "choix1", "choix2", "choix3", "choix4"
           ],
           idReponse: id du choix exacte dans le tableau de choix (par exemple 0 pour choix1)
         },
         etc...
       ]
    }

    Un seul choix doit etre la vrai reponse et l'index qu'il a dans le tableau doit etre
    celui qui est inscrit dans le champs idReponse.
    Fait en sorte que la reponse soit reellement correct.
    Fait en sorte que ce soit complet en ne depassant pas 2500 tokens
`;
  try{
    const completions = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2500,
      });
    
      const levelTest = JSON.parse(completions.data.choices[0].text)
      return levelTest;
  }catch(err){
    console.log(err)
    throw err
  }
};

module.exports = {
  generateLevelTest,
};
