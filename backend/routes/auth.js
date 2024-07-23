const express = require("express");
var bcrypt = require("bcryptjs");
const fetchUser = require("../middleware/fetchUser");
var jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

JWT_SECRET = "harsh";
//Route1: Create a User using: POST "/api/auth/createuser". dosen't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a vid email").isEmail(),
    body("password", "must be atleast 5 letters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ success,error: "sorry a user with this email already exists" });
      }
      // if user with same credential not present create a new user else return above message. i have also put it into try and catch to make the debugging easier
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,auth_token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route2: authenticate a user POST "/api/auth/login" no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            errors: "Please try to login with correct credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, auth_token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route3: get loggedin user details POST "/api/auth/getuser" login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
