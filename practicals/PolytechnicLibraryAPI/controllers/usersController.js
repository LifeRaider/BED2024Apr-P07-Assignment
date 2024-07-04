require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function registerUser(req, res) {
    const { username, password, role } = req.body;

    try {
        // Validate user data
        if (role != 'member' && role != 'librarian') {
            console.log("Do not pass")
            return res.status(400).json({ message: "Invalid role" });
        }

        // Check for existing username
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in database
        try {
            const createdUser = await User.createUser(username, hashedPassword, role);
            res.status(201).json(createdUser);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error creating user");
        }

        // return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    const { username, password } = req.body;
  
    try {
      // Validate user credentials
      const user = await User.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password with hash
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const payload = {
        id: user.id,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" }); // Expires in 1 hour
  
      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerUser,
    login,
};