var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function auth(req, res, next) 
{
    const token = req.header('x-auth-token');
    if (!token) 
    {
        return res.status(401).json({ message: 'Aucun token, autorisation refusée' });
    }

    try 
    {
        const decoded = jwt.verify(token, "Tsanta");
        req.user = decoded;
        next();
    } 
    catch (err) 
    {
        res.status(400).json({ message: 'Token non valide' });
    }
}
 
router.post('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const numJour = req.body.numJour;
    const heure_debut = req.body.heure_debut;
    const heure_fin = req.body.heure_fin;
    const matiere = req.body.matiere;
    const theme = req.body.theme;
  
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
  
    // Vérifier si le nouveau programme chevauche avec un programme existant
    const chevauchement = await db.collection("program").findOne({
      etudiantId,
      numJour,
      $or: [
        { heure_debut: { $lt: heure_debut } , heure_fin: { $gt: heure_debut } },
        { heure_debut: { $gte: heure_debut, $lt: heure_fin } },
        { heure_debut: { $lte: heure_debut } , heure_fin: { $gte: heure_fin } },
        { heure_debut: { $lte: heure_debut } , heure_fin: { $gt: heure_debut, $lt: heure_fin } },
        { heure_debut: { $gte: heure_debut, $lt: heure_fin }, heure_fin: { $gte: heure_fin } },
      ]
    });
  
    if (chevauchement) {
      res.status(400).json({ message: "Le nouveau programme chevauche avec un programme existant" });
    } else {
      const newProgram = { etudiantId, heure_debut: heure_debut, heure_fin: heure_fin, matiere, theme, numJour };
      const result = await db.collection("program").insertOne(newProgram);
      const insertedProgram = { id: result.insertedId, ...newProgram };
      res.status(201).json({ program: insertedProgram, message: "Programme ajouté dans l'emploi du temps" });
    }
  
     client.close();
  });

  module.exports = router;
  
  
  