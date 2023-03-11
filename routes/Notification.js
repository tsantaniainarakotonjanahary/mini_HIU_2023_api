var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../authentification/auth');
const schedule = require('node-schedule');
const moment = require('moment');


    const admin = require('firebase-admin');
    const privateKey1 = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw2R4T4S/lumwv\nfjvtlNQYVrQo/OBTEGJTdFVn2HKHKMhp+azoLmYqw0ylZo8DZTwIZ1BFdMLKpwFl\nyPyxOjuustKWHlXIEWGEzdc96i7Ixi8RPFPH+zcHJpLrTIDXAwJ8bpEosmpmeFdV\nZKS3odvbo4H5lhDjYktfQA6yvUCMwFNsTOVbD5I16jkjtgB3/ZRf6TinvMS/rL3j\nBu1zEXoSCXZ8d46Q9WbhCr5gIfTWD3bTgISP7ZyM1Gj3OSoWQ3T9Cncwu8dOpzDA\nK9HjSOTwL4zztArH9TZrl9n36RLHIvxzgcOKHXvbECMhdkmOBM3znMTmMeqvgCwS\nzzmEQxp3AgMBAAECggEAAhdfMq78C`
    const privateKey2 = `QRuWRVuEf4rj+oekUmEQZc1AnWiuOqnWA/U\nZuRr9gbucF0E4APZdxnQXu0R1vBtiUX2T0TUMChXIla9BMdxDj+eXpqsi+/kA73M\nOrDy8K941B3RqPSrpV9EvUH1d3y8o1+S8NCS3hUM64kAdXof0wCLkaHJSrXQOJnc\nlODkJ2AO6b3jLtUbefdN/5fjEVEDHdo6x80zNH/IlpGCUoV2BlzGebh61xNNGeE2\nGN4VvAq4zxVO67lJWjxCxF67qvlZhebTgFXk7uKHnrIE83kRBsB9RHmjtt2Tj8ia\n1v5YJXG6HsklZhKik1ro75tLgLIzKgYUAAwBHKacWQKBgQDpaiSVTCfMQTl7u7gH\nvX/aZ37L0iZtzLyIgWHgzZQNDzZHII8Vib8CsEEg6+mvSctUiRzv/6oeDifF9XKT\nQT0HBDpzwR2o0DVIB8yI8mYlvXOtSJbybaFYUb0+30+Rkufc/ZSJXMMIsLDY2MHf\ni+DS3PDSa5+87imEjs8nwcDcJQKBgQDB9ceEfdLeIqvPVg8L3Oq+oOsIWVwPUE4k\nMcEf547nccf9eGMsHw/MFBBy/UHK8EAtftmjDkvNLQvEsHKpfPTr8l8H07MYdxAA\nHqQ7zQ7X5eNMgyOJYhXCsinSF9fL`
    const privateKey3 = `aF3uYBCGjTBP+2Dhf9uCIAoel8BkHNuOd0Ql\n/OWXUvOLawKBgCR7LXqUK4g2DYj0PwAesxPspxmuH8l7fWAMcMLU/rXH0eDuCs7/\n93WxHIzLsntuGjR9NaOhHvKRnc/H2/99687j70rWPQ98c0dtyJ8C28o8QQ8tUEJV\ntij6pYxlFKeZAVo92/BYKjd6fjl2L18EGsB6Pb11isLZqm2IcIIzOzRtAoGAa+V2\nlNyNtiahXthnzFibeWn49Q8IqDgrD/Vhkob0twlTkEwtFvk8h3FN6Tm7JNJbUTO0\njAFC56M8XbEuR9yMPsj4VllM0rpA+2AQSnf63t0ygXieBym6IzGLFCVRVQT848Mq\nzj6ydnvHXAoNKSj7mCMg0lA/TtRH4734ViK9+nsCgYEA06zfyHXTXK7MyCdsEMmg\nE7N7nDlMsG5hmNzj4Q7VD+R51y1ktydf2IOdPvlAy`
    const privateKey4 = `hkObro4fYtW0QdN9EgAWWyD\nW8fiWQLy9qrD0ggsbcty0hqR6VKYDKXF8z8LetvwNMtmGcO2/Gje3f88cTgRY1oK\n2hr2V0JUECyiMxaZBWEk7SU=\n-----END PRIVATE KEY-----\n`
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "hiu-interne",
            clientEmail: "firebase-adminsdk-7yafg@hiu-interne.iam.gserviceaccount.com",
            privateKey: `${privateKey1}${privateKey2}${privateKey3}${privateKey4}`,
        }),
        databaseURL: 'https://hiu-interne-default-rtdb.firebaseio.com/'
    });

  

    async function sendNotifExam(req, res, next) {
        const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
        await client.connect();
        const db = client.db("hiu");
        const now = new Date(); 
        const exams = await db.collection("exam").find({ date_fin: { $gt: now } }).toArray(); 
        const clientUser = await db.collection("clientUser").find().toArray(); 
        let today = new Date();
        let examsToCome = [];
        for (let i = 0; i < exams.length; i++) {
          let examDate = moment(exams[i].date_fin);
          let timeDiff = examDate.diff(moment(), 'seconds'); 
          let remainingTime = moment.duration(timeDiff, 'seconds').humanize();
          console.log(`Remaining time for exam ${exams[i]._id}: ${remainingTime}`);
          let dayDiff = timeDiff / (1000 * 3600 * 24); 
          if (dayDiff >= 0 && dayDiff <= 3) { 
            examsToCome.push(exams[i]);
          }
        }
        const result = examsToCome.filter(exam => clientUser.some(user => user.etudiantId === exam.etudiantId)).map(exam => ({etudiantId: exam.etudiantId, date_debut: exam.date_debut, date_fin: exam.date_fin, matiere: exam.matiere, theme: exam.theme, token: clientUser.find(user => user.etudiantId === exam.etudiantId).token}));
        for (let i = 0; i < result.length; i++) {
          const exam = result[i];
          const examDate = moment(exam.date_fin);
          const diff = examDate.diff(moment(), 'seconds');
          const remainingTime = moment.duration(diff, 'seconds').humanize();
          const message = {
            notification: {
              title: 'Rappel',
              body: `examen ${exam.matiere} sur le thème ${exam.theme}. Temps restant: ${remainingTime}`
            },
            token: exam.token
          };
          console.log(message);
          admin.messaging().send(message).then(async (response) => {
             console.log('Successfully sent message:', response);
             //const insertedClientUser = await db.collection("notification").insertOne(newClientUser); 
         }).catch((error) => {
            console.log('Error sending message:', error);
          });
        }
        client.close();
    }


setInterval(sendNotifExam,10000);



router.post('/saveTokenDevice', auth, async function(req, res, next) {
    const etudiantId = req.user.id;
    const client = new MongoClient('mongodb+srv://tsanta:ETU001146@cluster0.6oftdrm.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("hiu");
    const existingClientUser = await db.collection("clientUser").findOne({ etudiantId });
    if (existingClientUser) {
        const updatedClientUser = await db.collection("clientUser").updateOne(
            { etudiantId },
            { $set: { token: req.body.token } }
        );
        res.status(200).json({ program: updatedClientUser, message: "Device to notify updated" });
    } else {
        const newClientUser = { etudiantId, token: req.body.token };
        const insertedClientUser = await db.collection("clientUser").insertOne(newClientUser);
        res.status(201).json({ program: insertedClientUser, message: "Device to notify saved" });
    }
    client.close();
});


module.exports = router;
