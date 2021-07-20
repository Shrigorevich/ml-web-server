import { config } from 'dotenv';
import jwt from "jsonwebtoken";
config();

function auth(req, res, next) {

   const token = req.header("x-auth-token");
   //Check for token
   if (!token) {
      res.status(401).json({ msg: "No token, authorization denied" });
      return;
   }

   try {
      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SERCET);
      // Add user from payload
      req.user = decoded;
      next();
   } catch (e) {
      res.status(400).json({ msg: "Token is not valid" });
   }
}

export default auth;