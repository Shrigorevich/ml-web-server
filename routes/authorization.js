const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/", async (req, res) => {
  const { nickname, password } = req.body;

  //Check for existing user
  const user = await User.findOne({ nickname: nickname });
  if (!user) return res.status(400).json({ msg: "User does not exists" });
  //Validate password
  bcrypt.compare(password, user.password).then((isMatch) => {
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials!" });

    jwt.sign(
      {
        id: user.id,
        nickname: user.nickname,
        paid: user.paid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" },
      async (err, token) => {
        if (err) throw err;
        res.status(200).json({
          access_token: token,
        });
      }
    );
  });
});

router.get("/profile", auth, (req, res) => {
  console.log("profile");
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
