const openai = require("../local-modules/openai/openaiLocal");
const { scrapGoogleSearch } = require("../services/ScrapService");

const generateLessons = async (subject, theme) => {
  // const prompt = `Genere un fichier json listant la liste des lessons axées sur un coté pratique que je dois maitriser pour mon examen de ${subject} sur le theme de ${theme}. Au max 2 lessons. dans chaque lecons, 1 site suggéré pour chacun. Le format devrait etre un peu comme suit: { datas:[ { "lessonTitle":"titre leçon", "suggestedWebsites":[ { title: "Titre du site", link: "lien du site", snippet : "Une portion de texte du site ..." } ] } ] }`;
  const prompt = `Genere un fichier json listant la liste des lessons axées sur un coté pratique que je dois maitriser pour mon examen de ${subject} sur le theme de ${theme}. Au max 3 lessons. Le format devrait etre un peu comme suit: { datas:["lesson1","lesson2"] }`;
  try {
    const completions = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 3000,
      temperature: 1
    });

    const lessonList = JSON.parse(completions.data.choices[0].text.trim())
    // console.log(completions.data.choices[0].text)
    const datas = lessonList.datas;
    // if (!datas)
    //   return res.status(500).json({
    //     error: "Erreur interne du serveur",
    //   });
    const formatedLessonsArray = [];
    for (let i = 0; i < datas.length; i++) {
      const scrapedSearch = await scrapGoogleSearch(
        `${subject} ${theme} ${datas[i].toString().trim()}`
      );
      formatedLessonsArray.push({
        lessonTitle: datas[i].toString(),
        suggestedWebsites: scrapedSearch,
      });
    }
    const newResponse = {
      datas: formatedLessonsArray,
    };
    // return lessonList;
    return newResponse
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  generateLessons,
};
