var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../authentification/auth')

router.get('/', auth , function(req, res, next) { res.send('Lessons'); });

module.exports = router;