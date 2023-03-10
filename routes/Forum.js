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
      const { publication , description} = req.body;
      const etudiant = await db.collection('etudiant').findOne({ _id:  new ObjectId(etudiantId) });
      const insertedforum = await db.collection('forum').insertOne({
        publication,
        description,
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
    const idCommentaire = new ObjectId();
    const result = await db.collection("forum").updateOne(
        { _id: new ObjectId(publicationId) },
        { $push: { commentaire: { 
            idCommentaire,
            texte: texte,
            idEtudiant: etudiantId,
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            reponse: []
        } } }
    );
    res.status(201).json( { message: "Commentaire ajouté" , result : { 
        idPublication: publicationId , 
        idCommentaire , 
        texte, 
        idEtudiant: etudiantId,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        reponse: [] 
    } } );
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

  router.delete('/:id', auth, async function(req, res, next) {
    const publicationId = req.params.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db("hiu");
      const result = await db.collection('forum').deleteOne({ _id: new ObjectId(publicationId) });
      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Publication supprimée avec succès." });
      } else {
        res.status(404).json({ message: "Publication introuvable." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la publication." });
    } finally {
      client.close();
    }
  });

  router.delete('/:id/commentaires/:idCommentaire', auth, async function(req, res, next) {
    const publicationId = req.params.id;
    const commentaireId = req.params.idCommentaire;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db("hiu");
      const result = await db.collection('forum').updateOne(
        { _id: new ObjectId(publicationId) },
        { $pull: { commentaire: { idCommentaire: new ObjectId(commentaireId) } } }
      );
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Commentaire supprimé avec succès." });
      } else {
        res.status(404).json({ message: "Commentaire introuvable." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression du commentaire." });
    } finally {
      client.close();
    }
  });

  router.delete('/:id/commentaires/:idCommentaire/reponses/:idReponse', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const publicationId = req.params.id;
    const commentaireId = req.params.idCommentaire;
    const reponseId = req.params.idReponse;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db("hiu");
        const etudiant = await db.collection('etudiant').findOne({ _id:  new ObjectId(etudiantId) });
        if (!etudiant) {
            res.status(401).json({ message: "Etudiant introuvable" });
            return;
        }
        const result = await db.collection("forum").updateOne(
            { _id: new ObjectId(publicationId), "commentaire.idCommentaire": new ObjectId(commentaireId) },
            { $pull: { "commentaire.$.reponse": { idReponse: new ObjectId(reponseId) } } }
        );
        if (result.modifiedCount === 0) {
            res.status(404).json({ message: "Publication, commentaire ou réponse introuvable" });
            return;
        }
        res.status(200).json({ message: "Réponse supprimée" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la réponse." });
    } finally {
        client.close();
    }
});

  
  



module.exports = router;
  
