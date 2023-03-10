var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../authentification/auth");
 

router.post('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const etudiant = await db.collection('etudiant').findOne({ _id:  new ObjectId(etudiantId) });
    const fichier = {
      lien: req.body.lien,
      nom: req.body.nom,
      utilisateur: {
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        idetudiant: etudiantId
      }
    };
    const dossierExistant = await db.collection("dossier").findOne({ dossier: req.body.dossier });
    if (dossierExistant) {
      await db.collection("dossier").updateOne(
        { dossier: req.body.dossier },
        { $push: { fichier: fichier }}
      );
      res.status(201).json({ message: "Fichier ajouté dans le dossier " + req.body.dossier });
    } else {
      const newDossier = {
        dossier: req.body.dossier,
        fichier: [fichier]
      };
      const insertedDossier = await db.collection("dossier").insertOne(newDossier);
      res.status(201).json({ message: "Dossier créé avec succès" });
    }  
    client.close();
});

router.get('/', auth, async function(req, res, next) {
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const dossiers = await db.collection("dossier").find({}).toArray();
    res.status(200).json(dossiers);
    client.close();
});
  
  


module.exports = router;

