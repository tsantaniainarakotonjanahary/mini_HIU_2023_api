const openai = require("../local-modules/openai/openaiLocal");
const { scrapGoogleSearch } = require("../services/ScrapService");

const generateLessons = async (subject, theme) => {
  const prompt = `
    Sans mettre aucune introduction ni conclusion dans ta reponse, genere un fichier json bien formatté listant 
    la liste des lessons que je dois maitriser pour mon examen de ${subject} sur le theme de ${theme} en suivant un ordre de priorité.
    Site les grands points. Au max 3 lessons. dans chaque lecons 2 sites suggérées chacuns.
    Le format devrait etre un peu comme suit:
    {
        datas:[
          {
            "lessonTitle":"titre leçon",
            "suggestedWebsites":[
              {
                title: "Titre du site",
                link: "lien du site",
                snippet : "Une portion de texte du site ..."
              }
            ]
          }
        ]
    }
`;
  try {
    const completions = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 3000,
    });

    const lessonList = JSON.parse(completions.data.choices[0].text.trim());

    // const datas = lessonList.datas;
    // if (!datas)
    //   return res.status(500).json({
    //     error: "Erreur interne du serveur",
    //   });
    // const formatedLessonsArray = [];
    // for (let i = 0; i < datas.length; i++) {
    //   const scrapedSearch = await scrapGoogleSearch(
    //     `${subject} ${theme} ${datas[i].toString().trim()}`
    //   );
    //   formatedLessonsArray.push({
    //     lessonTitle: datas[i].toString(),
    //     suggestedWebsites: scrapedSearch,
    //   });
    // }
    // const newResponse = {
    //   datas: formatedLessonsArray,
    // };
    return lessonList;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  generateLessons,
};
