require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const test = (req, res) => {
  const user = req.user
  res.status(201).json({ message: "everything is a ok", user});
};

async function register(req, res) {
  const { email, password, confirmPassword, userType } = req.body;

  try {
    // Validate user data
    if (password != confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    } else if (req.user) {
      if (req.user.userType != "admin" || userType !== "teacher") {
        return res.status(403).json({ message: "Forbidden user creation" });
      }
    } else if (userType !== "student" && userType !== "parent") {
      return res.status(403).json({ message: "Unallowed user type" });
    }

    // Check for existing username
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    try {
      const createdUser = await User.createUser(req.body, hashedPassword);
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
  const { email, password } = req.body;
  console.log(email, password)
  try {
    // Validate user credentials
    const user = await User.getUserByEmail(email);
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
      userType: user.userType,
      username: user.username
    };
    const userType = user.userType
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" }); // Expires in 1 hour
    return res.status(200).json({ token, userType });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function editUser(req, res) {
  const { email } = req.body;
  const userID = req.user.id

  try {
    // Check for existing user ID
    const existingUser = await User.getUserById(userID);
    if (!existingUser) {
      return res.status(409).json({ message: "User does not exists" });
    }

    // Check for existing email
    const existingEmail = await User.getUserByEmail(email);
    if (existingEmail && existingEmail.id != userID) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // Edit user in database
    try {
      const editedUser = await User.editUser(req.body, userID);
      res.status(201).json(editedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error editing user");
    }

    // return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  const userID = req.user.id

  try {
    const users = await User.deleteUser(userID);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserById(req, res) {
  const userID = req.user.id

  try {
    const users = await User.getUserById(userID);
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
    test,
    register,
    login,
    editUser,
    deleteUser,
    getAllUsers,
    getUserById
};