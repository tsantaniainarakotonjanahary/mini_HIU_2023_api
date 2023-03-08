var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../authentification/auth')

router.get('/', auth , function(req, res, next) { res.send('Etudiant'); });

router.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();

    const db = client.db("hiu");

    let user = await db.collection("etudiant").findOne({ email: email });

    if (!user) 
    {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
    }


    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) 
    {
        return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "Tsanta", { expiresIn: 86400 });

    res.status(200).json({ user: user, token: token });

    client.close();
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/register', async (req, res) => {

    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConf = req.body.passwordConf;
    const tel = req.body.tel;
    const profil = req.body.profil;
    const classe = req.body.classe;


    if (password !== passwordConf) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Adresse e-mail non valide" });
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins une lettre majuscule" });
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins une lettre minuscule" });
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins un chiffre" });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins un caractère spécial" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
    }

        
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");

    const emailExists = await db.collection("etudiant").findOne({ email: email });

    if (emailExists) 
    {
        return res.status(400).json({ message: "Cette adresse e-mail est déjà utilisée" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newEtudiant = {
        nom: nom,
        prenom: prenom,
        email: email,
        password: hash,
        profil: profil,
        classe : classe , 
        tel : tel,
    };

    const { insertedId } = await db.collection("etudiant").insertOne(newEtudiant);

    const token = jwt.sign({ id: insertedId }, "Tsanta", { expiresIn: 86400 });

    res.status(200).json({ message: "Profile created successfully" , token  , user: newEtudiant , id : insertedId });
    client.close();
});

router.put('/update', auth, async (req, res) => {
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority',{ useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    let user = await db.collection("etudiant").findOne({_id: new ObjectId(req.user.id)});
    if (!user) 
    {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    user.nom = req.body.nom || user.nom;
    user.prenom = req.body.prenom || user.prenom;
    user.email = req.body.email || user.email;
    user.profil = req.body.profil || user.profil;
    user.classe = req.body.classe || user.classe;
    user.tel = req.body.tel|| user.tel;

    if(req.body.password){ user.password = await bcrypt.hash(req.body.password, 10); }
    db.collection("etudiant").updateOne({_id: new ObjectId(req.user.id)}, { $set: user },(err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating profile" });
        }
        client.close();
        res.status(200).json({ message: "Profile updated successfully" });
    });
});




module.exports = router;

