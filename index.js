const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');

// set up port
// const PORT = process.env.PORT || 3000;
const HOST = app.get('ip');
const PORT = app.get('port');

var networkInterfaces = os.networkInterfaces( );

// console.log( networkInterfaces );

app.use(bodyParser.json());
app.use(cors());

//add routes
const router = require('./routes/router.js');
app.use('/api',router);

//run server
app.listen(3000, () => console.log(`server running on ${HOST} and port ${PORT} `));

app.get('/', (req, res) => res.send('Server Up'))