const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const authorization = require('./routes/authorization');

// var Parse = require('parse/node');
// Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
// Parse.serverURL = 'https://parseapi.back4app.com/'

const app = express(); 
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());


app.use('/authorization', authorization)

app.get('/', (req, res) => {
    res.status(200).send({ "ping": "pong" })  
}) 

module.exports = app;