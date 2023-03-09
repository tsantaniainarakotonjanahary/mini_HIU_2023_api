var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../authentification/auth');

router.post('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db("hiu");
      const { publication } = req.body;
      const etudiant = await db.collection('etudiant').findOne({ _id:  new ObjectId(etudiantId) });
      const insertedforum = await db.collection('forum').insertOne({
        publication: publication,
        idEtudiant: etudiantId,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        commentaire: []
      });
  
      res.status(201).json({ program: insertedforum, message: "Publication forum créée avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la création de la publication forum." });
    } finally {
      client.close();
    }
});

router.post('/:id/commentaires', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const publicationId = req.params.id;
    const { texte } = req.body;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const etudiant = await db.collection('etudiant').findOne({ _id:  new ObjectId(etudiantId) });
    const result = await db.collection("forum").updateOne(
        { _id: new ObjectId(publicationId) },
        { $push: { commentaire: { 
            idCommentaire: new ObjectId(),
            texte: texte,
            idEtudiant: etudiantId,
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            reponse: []
        } } }
    );
    res.status(201).json({ message: "Commentaire ajouté" });
    client.close();
});

router.post('/:id/commentaires/:idCommentaire/reponses', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const publicationId = req.params.id;
    const commentaireId = req.params.idCommentaire;
    const { texte } = req.body;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const etudiant = await db.collection('etudiant').findOne({ _id:  new ObjectId(etudiantId) });
    if (!etudiant) {
        res.status(401).json({ message: "Etudiant introuvable" });
        return;
    }
    const result = await db.collection("forum").updateOne(
        { _id: new ObjectId(publicationId), "commentaire.idCommentaire": new ObjectId(commentaireId) },
        { $push: { "commentaire.$.reponse": { 
            idReponse: new ObjectId(),
            texte: texte,
            idEtudiant: etudiantId,
            nom: etudiant.nom,
            prenom: etudiant.prenom
        } } }
    );
    if (result.modifiedCount === 0) {
        res.status(404).json({ message: "Publication ou commentaire introuvable" });
        return;
    }
    res.status(201).json({ message: "Réponse ajoutée" });
    client.close();
});


router.get('/', async function(req, res, next) {
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db("hiu");
      const forums = await db.collection('forum').find().toArray();
      res.status(200).json(forums);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération des publications forum." });
    } finally {
      client.close();
    }
  });
  



module.exports = router;
  
