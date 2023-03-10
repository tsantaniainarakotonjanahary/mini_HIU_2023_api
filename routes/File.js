var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../authentification/auth");
 
/*
router.post('/', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const newDossier = {};
    const insertedDossier = await db.collection("dossier").insertOne(newDossier);
    res.status(201).json({ program: insertedTodo, message: "Todo ajouté " });
    client.close();
});
*/


module.exports = router;

