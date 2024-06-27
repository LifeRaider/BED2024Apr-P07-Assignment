const User = require("../models/user");
const passport = require('passport');

const test = (req, res) => {
    res.json("everything is a ok")
};

const createUser = async (req, res) => {
    const newUser = req.body;
    try {
        const createdUser = await User.createUser(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        if (error.message.includes('Violation of UNIQUE KEY constraint')) {
            console.error("User with this email already exists.");
            res.status(409).json({ message: 'User with this email already exists.' }); // 409 Conflict
        } else {
            console.error("Error creating user: ", error);
            res.status(500).json({ message: "Error creating user" });
        }
    }
};

const initializePassport = (passport) => {
    try {
        const done = User.initializePassport(passport);
    } catch (error) {
        console.log(error)
    }
}

const loginUser = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: 'Authentication failed' });
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Login failed' });
          }
          req.session.user = user;
          return res.json({ message: 'Login successful', user });
        });
    })(req, res);
};

const checkAuthenticated = (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
}

const logout = (req, res) => {
    req.logOut((error) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ message: 'Logout failed' });
        }
      return res.json({ message: 'Logout successful'});
    })
}

module.exports = {
    test,
    createUser,
    initializePassport,
    loginUser,
    checkAuthenticated,
    logout,
};