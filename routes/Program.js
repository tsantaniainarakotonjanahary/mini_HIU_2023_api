var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const auth = require("../authentification/auth");

router.post("/", auth, async function (req, res, next) {
  const etudiantId = req.user.id;
  const numJour = req.body.numJour;
  const heure_debut = req.body.heure_debut;
  const heure_fin = req.body.heure_fin;
  const matiere = req.body.matiere;
  const theme = req.body.theme;

  const client = new MongoClient(
    "mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  await client.connect();
  const db = client.db("hiu");

  // Vérifier si le nouveau programme chevauche avec un programme existant
  const chevauchement = await db.collection("program").findOne({
    etudiantId,
    numJour,
    $or: [
      { heure_debut: { $lt: heure_debut }, heure_fin: { $gt: heure_debut } },
      { heure_debut: { $gte: heure_debut, $lt: heure_fin } },
      { heure_debut: { $lte: heure_debut }, heure_fin: { $gte: heure_fin } },
      {
        heure_debut: { $lte: heure_debut },
        heure_fin: { $gt: heure_debut, $lt: heure_fin },
      },
      {
        heure_debut: { $gte: heure_debut, $lt: heure_fin },
        heure_fin: { $gte: heure_fin },
      },
    ],
  });

  if (chevauchement) {
    res.status(400).json({
      message: "Le nouveau programme chevauche avec un programme existant",
    });
  } else {
    const newProgram = {
      etudiantId,
      heure_debut: heure_debut,
      heure_fin: heure_fin,
      matiere,
      theme,
      numJour,
    };
    const result = await db.collection("program").insertOne(newProgram);
    const insertedProgram = { id: result.insertedId, ...newProgram };
    res.status(201).json({
      program: insertedProgram,
      message: "Programme ajouté dans l'emploi du temps",
    });
  }

  client.close();
});

router.delete("/", auth, async function (req, res, next) {
  const etudiantId = req.user.id;
  const idProgram = req.body.idProgram;

  const client = new MongoClient(
    "mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  await client.connect();
  const db = client.db("hiu");

  const result = await db
    .collection("program")
    .deleteOne({ _id: new ObjectId(idProgram), etudiantId });

  if (result.deletedCount === 1) {
    res
      .status(200)
      .json({ message: "Programme supprimé de l'emploi du temps" });
  } else {
    res.status(404).json({
      message: "Programme non trouvé ou n'appartient pas à l'étudiant connecté",
    });
  }

  client.close();
});

router.put("/:idProgram", auth, async function (req, res, next) {
  const etudiantId = req.user.id;
  const idProgram = req.params.idProgram;
  const numJour = req.body.numJour;
  const heure_debut = req.body.heure_debut;
  const heure_fin = req.body.heure_fin;
  const matiere = req.body.matiere;
  const theme = req.body.theme;

  const client = new MongoClient(
    "mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  await client.connect();
  const db = client.db("hiu");

  // Vérifier si le programme à mettre à jour existe et appartient à l'étudiant connecté
  const existingProgram = await db
    .collection("program")
    .findOne({ _id: new ObjectId(idProgram), etudiantId });
  if (!existingProgram) {
    res.status(404).json({
      message: "Programme non trouvé ou n'appartient pas à l'étudiant connecté",
    });
    client.close();
    return;
  }

  // Vérifier si le nouveau programme chevauche avec un programme existant autre que celui à mettre à jour
  const chevauchement = await db.collection("program").findOne({
    etudiantId,
    numJour,
    _id: { $ne: existingProgram._id },
    $or: [
      { heure_debut: { $lt: heure_debut }, heure_fin: { $gt: heure_debut } },
      { heure_debut: { $gte: heure_debut, $lt: heure_fin } },
      { heure_debut: { $lte: heure_debut }, heure_fin: { $gte: heure_fin } },
      {
        heure_debut: { $lte: heure_debut },
        heure_fin: { $gt: heure_debut, $lt: heure_fin },
      },
      {
        heure_debut: { $gte: heure_debut, $lt: heure_fin },
        heure_fin: { $gte: heure_fin },
      },
    ],
  });

  if (chevauchement) {
    res.status(400).json({
      message: "Le nouveau programme chevauche avec un programme existant",
    });
    client.close();
    return;
  }

  // Mettre à jour le programme dans la base de données
  const result = await db.collection("program").updateOne(
    { _id: new ObjectId(idProgram), etudiantId },
    {
      $set: {
        heure_debut: heure_debut,
        heure_fin: heure_fin,
        matiere,
        theme,
        numJour,
      },
    }
  );

  if (result.modifiedCount === 1) {
    const updatedProgram = {
      _id: existingProgram._id,
      etudiantId,
      heure_debut: heure_debut,
      heure_fin: heure_fin,
      matiere,
      theme,
      numJour,
    };
    res.status(200).json({
      program: updatedProgram,
      message: "Programme mis à jour dans l'emploi du temps",
    });
  } else {
    res.status(404).json({
      message: "Programme non trouvé ou n'appartient pas à l'étudiant connecté",
    });
  }

  client.close();
});

router.get("/", auth, async function (req, res, next) {
  const etudiantId = req.user.id;
  const client = new MongoClient(
    "mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  await client.connect();
  const db = client.db("hiu");

  const programs = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  const cursor = await db.collection("program").find({ etudiantId });

  await cursor.forEach((program) => {
    if (!isNaN(parseInt(program.numJour)))
      programs[program.numJour].push(program);
  });

  // sorting programs
  Object.keys(programs).map((programKey, key) => {
    const program = programs[programKey];
    program.sort(function (a, b) {
      if (a.heure_debut && b.heure_fin) {
        if (a.heure_debut < b.heure_debut) {
          return -1;
        }
        if (a.heure_debut > b.heure_debut) {
          return 1;
        }
        return 0;
      }
    });
    programs[programKey] = program
  });

  res.status(200).json(programs);
});

module.exports = router;
