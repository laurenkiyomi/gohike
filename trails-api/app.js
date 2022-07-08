const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const trails = require('./routes/trails');

const app = express(); 
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());


app.use('/trails', trails)

app.get('/', (req, res) => {
    res.status(200).send({ "ping": "pong" })  
}) 

module.exports = app;
