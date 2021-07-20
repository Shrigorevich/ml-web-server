import { Router } from "express";
const router = Router();
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth.js";

router.post("/", async (req, res) => {
  const { nickname, password, ip } = req.body;

  //Check for existing user
  const user = await User.findOne({ nickname: nickname });

  if (!user) { return res.status(400).json({ msg: "User does not exists" }); }
  else if (!ip) { return res.status(400).json({ msg: "Invalid Ip" }); }

  //Validate password
  bcrypt.compare(password, user.password).then(async (isMatch) => {
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials!" });

    const existingIp = user.ips.find(item => item === ip);

    if (!existingIp) {
      await updateOne({ _id: user._id }, { ips: [...user.ips, ip] })
    }

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
  findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

export default router;
