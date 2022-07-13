const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const authorization = require('./routes/authorization');
const posts = require('./routes/posts');
const trails = require('./routes/trails');
const user = require('./routes/user');

const app = express(); 
app.use(bodyParser.json({limit: '500mb'}));
app.use(morgan('tiny'));
app.use(cors());

app.use('/authorization', authorization)
app.use('/posts', posts)
app.use('/trails', trails)
app.use('/user', user)

app.get('/', (req, res) => {
    res.status(200).send({ "ping": "pong" })  
}) 

module.exports = app;