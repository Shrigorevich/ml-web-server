var express = require('express')
var app = express()

const connectDB = require('./db');
connectDB();

const dotenv = require('dotenv');
dotenv.config();

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log(`Server started on port ${process.env.PORT}`);
});