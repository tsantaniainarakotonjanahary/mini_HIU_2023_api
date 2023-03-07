var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const newTodo = {
        etudiantId,
      date_today: new Date(req.body.date_today),
      tache: req.body.tache,
      isDone: req.body.isDone || "no"
    };
    const insertedTodo = await db.collection("todo").insertOne(newTodo);
    res.status(201).json({ program: insertedTodo, message: "Todo ajouté " });
    client.close();
});

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

router.get('/:date', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const date = new Date(req.params.date);
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
  const result = await db.collection("todo").updateOne({ _id: ObjectId(todoId), etudiantId: etudiantId }, { $set: updatedTodo });
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
  const result = await db.collection("todo").updateOne({ _id: ObjectId(todoId), etudiantId: etudiantId }, { $set: updatedTodo });
  if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Todo non trouvé" });
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
  const result = await db.collection("todo").deleteOne({ _id: ObjectId(todoId), etudiantId: etudiantId });
  if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Todo non trouvé" });
  }
  res.status(200).json({ message: "Todo supprimé avec succès" });
  client.close();
});

  module.exports = router;
  