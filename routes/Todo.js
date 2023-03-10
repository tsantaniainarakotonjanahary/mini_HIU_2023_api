var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../authentification/auth');
const {attributeBadge} = require('../services/badgeService');


router.post('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    var myDate = new Date();
    myDate.setHours(myDate.getHours() + 3);
    myDate.setUTCHours(0, 0, 0, 0);
    const newTodo = {
      etudiantId,
      date_today: myDate,
      tache: req.body.tache,
      isDone: req.body.isDone || "no"
    };
    
    const insertedTodo = await db.collection("todo").insertOne(newTodo);
    const todos = await db.collection("todo").find({ etudiantId: etudiantId}).toArray();
    console.log(todos.length);
    if(todos.length == 1) {
      const badge = await attributeBadge(etudiantId,'640bdf21b153d93d4122cdd7');
      res.status(201).json({ program: insertedTodo, message: "Todo ajouté "  , badge });
    } 
    else {
      const badge = null;
      res.status(201).json({ program: insertedTodo, message: "Todo ajouté "  , badge});
    }
    
    client.close();
});

router.get('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const date = new Date();
    date.setHours(date.getHours() + 3);
    date.setUTCHours(0, 0, 0, 0);
    console.log(date);
    const todos = await db.collection("todo").find({ etudiantId: etudiantId, date_today: date }).toArray();
    res.status(200).json(todos);
    client.close();
});
  
router.put('/finir/:id', auth, async function(req, res, next) {
  const etudiantId = req.user.id;
  const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
  await client.connect();
  const db = client.db("hiu");
  const todoId = req.params.id;
  const updatedTodo = {
      isDone: "yes"
  };
  const result = await db.collection("todo").updateOne({ _id: new  ObjectId(todoId), etudiantId: etudiantId }, { $set: updatedTodo });
  if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Todo non trouvé" });
  }

  res.status(200).json({ message: "Todo achevé avec succès" });
  client.close();
});

router.put('/:id', auth, async function(req, res, next) {
  const etudiantId = req.user.id;
  const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
  await client.connect();
  const db = client.db("hiu");
  const todoId = req.params.id;
  const updatedTodo = {
      tache: req.body.tache
  };
  const result = await db.collection("todo").updateOne({ _id: new ObjectId(todoId), etudiantId: etudiantId }, { $set: updatedTodo });
  if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Aucune modification" });
  }
  res.status(200).json({ message: "Todo mis à jour avec succès" });
  client.close();
});

router.delete('/:id', auth, async function(req, res, next) {
  const etudiantId = req.user.id;
  const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
  await client.connect();
  const db = client.db("hiu");
  const todoId = req.params.id;
  const result = await db.collection("todo").deleteOne({ _id:  new ObjectId(todoId), etudiantId: etudiantId });
  if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Todo non trouvé" });
  }
  res.status(200).json({ message: "Todo supprimé avec succès" });
  client.close();
});

module.exports = router;
  