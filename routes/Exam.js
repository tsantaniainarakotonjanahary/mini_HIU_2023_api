var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../authentification/auth')

    router.post('/', auth, async function(req, res, next) {
        const etudiantId = req.user.id;
        const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
        await client.connect();
        const db = client.db("hiu");
    
        const newExam = {
            etudiantId,
        date_debut: new Date(req.body.date_debut),
        date_fin: new Date(req.body.date_fin),
        matiere: req.body.matiere,
        theme: req.body.theme
        };
    
        const insertedExam = await db.collection("exam").insertOne(newExam);
        res.status(201).json({ examen: insertedExam, message: "Examen ajouté" });
        client.close();
    });

    // Get All Exams (where start date is in the future)
    router.get('/', auth, async function(req, res, next) {
        const etudiantId = req.user.id;
        const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
        await client.connect();
        const db = client.db("hiu");
    
        const now = new Date(); // current date
        const exams = await db.collection("exam").find({ etudiantId: etudiantId, date_fin: { $gt: now } }).toArray(); // filter by etudiantId and start date > current date
        res.status(200).json({ exams });
        client.close();
    });

    // Get exam by id
    router.get('/:id', auth, async function(req, res, next) {
      const examId = req.params.id
      const etudiantId = req.user.id;
      const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
      await client.connect();
      const db = client.db("hiu");
      try{
        const exam = await db.collection("exam").findOne({ _id: new ObjectId(examId), etudiantId: etudiantId });
        if(exam){
          res.status(200).json(exam);
        }
        client.close();
        return
      }catch{
        res.status(500).json({
          message: "Server error"
        })
      }
  });

    
    router.delete('/:id', auth, async function(req, res, next) {
        const etudiantId = req.user.id;
        const examId = req.params.id;
        const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
        await client.connect();
        const db = client.db("hiu");
      
        const examToDelete = await db.collection("exam").findOne({ _id: new ObjectId(examId), etudiantId: etudiantId });
        if (!examToDelete) {
          res.status(404).json({ message: "Examen non trouvé" });
          client.close();
          return;
        }
      
        const result = await db.collection("exam").deleteOne({ _id: new ObjectId(examId), etudiantId: etudiantId });
        res.status(200).json({ message: "Examen supprimé" });
        client.close();
      });

      
      router.put('/:id', auth, async function(req, res, next) {
        const etudiantId = req.user.id;
        const examId = req.params.id;
        const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
        await client.connect();
        const db = client.db("hiu");
      
        const examToUpdate = await db.collection("exam").findOne({ _id: new ObjectId(examId), etudiantId: etudiantId });
        if (!examToUpdate) {
          res.status(404).json({ message: "Examen non trouvé" });
          client.close();
          return;
        }
      
        const updatedExam = {
          etudiantId,
          date_debut: new Date(req.body.date_debut),
          date_fin: new Date(req.body.date_fin),
          matiere: req.body.matiere,
          theme: req.body.theme
        };
      
        const result = await db.collection("exam").updateOne({ _id: new ObjectId(examId), etudiantId: etudiantId }, { $set: updatedExam });
        res.status(200).json({ message: "Examen mis à jour" });
        client.close();
      });
      


module.exports = router;