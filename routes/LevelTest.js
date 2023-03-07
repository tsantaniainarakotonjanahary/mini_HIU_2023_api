var express = require("express");
var router = express.Router();
const auth = require("../authentification/auth");
const levelTestService = require('../services/LevelTestService')

router.get("/", auth, (req, res) => {
  return res.json("LevelTest");
});

router.post("/generate", auth, async(req, res, next) => {
    const {subject , theme} = req.body
    if(!subject || !theme){
        return res.status(500).json({
            error: "Veuillez definir les champs 'subject' et 'theme' dans le corps de la requete."
        })
    }
    try{
        const generatedLevelTest = await levelTestService.generateLevelTest(subject,theme)
        return res.send(generatedLevelTest)
    }catch(err){
        console.log(err)
        return res.status(500).json({
            error: err.toString()
        })
    }
});

module.exports = router;
