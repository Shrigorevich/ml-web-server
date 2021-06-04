var express = require('express')
var app = express()
const cors = require("cors");
const connectDB = require('./db');
connectDB();

app.use(cors());
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/authorization"));
app.use("/api/users", require("./routes/users"));

app.get('/getProfile', function (req, res) {
  res.status(201).json({
    firstName: "Roman",
    lastName: "Shcherbyna"
  })
})

app.listen(process.env.PORT, (err) => {
    err ? console.log(err) : console.log(`Server started on port ${process.env.PORT}`);
});