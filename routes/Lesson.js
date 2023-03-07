var express = require("express");
var router = express.Router();
const auth = require("../authentification/auth");
const lessonService = require('../services/LessonService')
const {scrapGoogleSearch} = require('../services/ScrapService')

router.get("/", auth, (req, res) => {
  return res.json("LevelTest");
});

router.post("/generate", auth, async(req, res, next) => {
    const {subject , theme} = req.body
    if(!subject || !theme){
        res.status(500).json({
            error: "Veuillez definir les champs 'subject' et 'theme' dans le corps de la requete."
        })
    }
    try{
        const generatedLessons = await lessonService.generateLessons(subject,theme)
        const datas = generatedLessons.datas
        if (!datas) return res.status(500).json({
            error: "Erreur interne du serveur"
        })
        const formatedLessonsArray = []
        for(let i=0;i<datas.length;i++){
            const scrapedSearch = await scrapGoogleSearch(`${subject} ${theme} ${datas[i].toString().trim()}`)
            formatedLessonsArray.push({
                lessonTitle: datas[i].toString(),
                suggestedWebsites: scrapedSearch
            })
        }
        const newResponse = {
            datas: formatedLessonsArray
        }
        res.send(newResponse)
    }catch(err){
        console.log(err)
        res.status(500).json({
            error: err.toString()
        })
    }
});

module.exports = router;
