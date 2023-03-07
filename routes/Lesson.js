var express = require("express");
var router = express.Router();
const auth = require("../authentification/auth");
const lessonService = require('../services/LessonService')

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
        const generatedLevelTest = await lessonService.generateLessons(subject,theme)
        res.send(generatedLevelTest)
    }catch(err){
        console.log(err)
        res.status(500).json({
            error: err.toString()
        })
    }
});

module.exports = router;
