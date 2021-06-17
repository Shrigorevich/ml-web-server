const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const auth = require('../middlewares/auth');

dotenv.config();

router.post("/", async (req, res) => {

   const { nickname, email, password, ip } = req.body;
   //Simple validation
   if (!nickname) {
      return res.status(400).json({ msg: "Please enter your username!" });
   }
   if (!email) {
      return res.status(400).json({ msg: "Please enter your email!" });
   }
   if (!password) {
      return res.status(400).json({ msg: "Please enter your password!" });
   }

   //Check for existing user
   const check = await User.findOne({
      $or: [
         { email }, { nickname }
      ]
   });

   if (check) {
      if (check.email === email) {
         console.log('email exists');
         return res.status(400).json({ msg: "User already exists. Email must be unique!" });
      } else if (check.nickname === nickname) {
         console.log('username exists');
         return res.status(400).json({ msg: "User already exists. Username must be unique!" });
      }
   }

   const user = new User({ nickname, email, password, ips: [ip] });
   //Create salt & hash
   bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
         if (err) throw err;
         user.password = hash;
         user.save().then((user) => {
            //Create token
            jwt.sign(
               { id: user.id },
               process.env.JWT_SECRET,
               { expiresIn: '24h' },
               (err, token) => {
                  if (err) throw err;
                  res.status(201).json({
                     access_token: token
                  });
               }
            );
         });
      });
   });
});

module.exports = router;

