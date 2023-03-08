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
      matière: req.body.matière,
      thème: req.body.thème
    };
  
    const insertedExam = await db.collection("exam").insertOne(newExam);
    res.status(201).json({ examen: insertedExam, message: "Examen ajouté" });
    client.close();
  });
  


module.exports = router;