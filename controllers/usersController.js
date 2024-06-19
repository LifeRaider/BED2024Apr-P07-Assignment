const User = require("../models/user");

const getAllUsers = async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
    }
};

const createUser = async (req, res) => {
    const newUser = req.body;
    try {
        const createdUser = await User.createUser(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        console.error("Error in createUser controller:", error);
        if (error.originalError && error.originalError.message.includes('Violation of UNIQUE KEY constraint')) {
            console.error("User with this email already exists.");
            res.status(409).json({ message: 'User with this email already exists.' }); // 409 Conflict
        } else {
            console.error("Error creating user: ", error);
            res.status(500).json({ message: "Error creating user" });
        }
    }
};

module.exports = {
    getAllUsers,
    createUser,
};