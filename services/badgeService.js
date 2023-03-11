
var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const attributeBadge = async (idEtudiant, idBadge) => {
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const badgeCollection = db.collection("badge");

    const updateResult = await badgeCollection.updateOne(
        { _id: new ObjectId(idBadge) },
        { $addToSet: { etudiants: { idEtudiant: idEtudiant } } }
    );
    var badge = await badgeCollection.findOne({_id : new ObjectId(idBadge)});
    console.log("------------------------");
    console.log(badge);
    console.log("------------------------");
    
    return { success: true, message: "Badge attribué avec succès" , badge };
    
    client.close();
};

module.exports = { attributeBadge, };