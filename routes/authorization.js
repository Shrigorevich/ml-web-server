const { Router } = require("express");
const router = Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./../middlwares/auth");

router.get("/verify", auth, async (req, res) => {
   const user = await User.findById(req.user.id)
   .select("-password")
   res.status(200).json({user: user, msg: "Verified"})
});

router.post("/", async (req, res) => {
   console.log('login');
   
   const { username, password } = req.body;

   //Simple validation
   if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
   }
   //Check for existing user
   const user = await User.findOne({ username });
   if (!user) return res.status(400).json({ msg: "User does not exists" });
   //Validate password
   bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
         return res.status(400).json({ msg: "Invalid credentials!" });

      jwt.sign(
         { id: user.id },
         config.get("jwtSecret"),
         { expiresIn: '24h' },
         async (err, token) => {
            if (err) throw err;
            res.status(200).json({
               token,
               user: {
                  id: user.id,
                  username: user.username,
               },
            });
         }
      );
   });
});

router.get("/profile", auth, (req, res) => {
   console.log('profile');
    User.findById(req.user.id)
       .select("-password")
       .then((user) => res.json(user));
});

module.exports = router;