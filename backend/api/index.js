const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const ConnectDB = require('../db');

// configure env
dotenv.config();

// database config
ConnectDB();

const app = express();
app.use(cors());
app.use(express.json());


//middleware 
app.use(morgan('dev'));
//accessing route
app.use('/api', require('../route'))
app.listen(8080, () => {
  console.log(`Backend running on http://localhost:8080`);
});
module.exports = app;