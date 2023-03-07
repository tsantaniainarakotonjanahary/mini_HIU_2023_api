const openai = require("../local-modules/openai/openaiLocal");

const generateLessons = async (examType, theme) => {
  const prompt = `
    Sans mettre aucune introduction ni conclusion dans ta reponse, genere un fichier json bien formatté listant 
    la liste des lessons que je dois maitriser pour mon examen de ${examType} sur le theme de ${theme} en suivant un ordre de priorité.
    Site les grands points.
    Le format devrait etre un peu comme suit:
    {
        datas:["lesson1","lesson2"]
    }
`;
  try{
    const completions = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500,
      });
    
      const lessonList = JSON.parse(completions.data.choices[0].text.trim())
      return lessonList;
  }catch(err){
    console.log(err)
    throw err
  }
};

module.exports = {
  generateLessons,
};
