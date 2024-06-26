const Class = require("../models/Class");

const getAllClasses = async (req, res) => {
    try {
      const classes = await Class.getAllClasses();
      res.json(classes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving classes");
    }
};

const getClassById = async (req, res) => {
    const classID = req.params.classID;
    try {
      const classObj = await Class.getClassById(classID);
      if (!classObj) {
        return res.status(404).send("Class not found");
      }
      res.json(classObj);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving class");
    }
};

const createClass = async (req, res) => {
    const newClass = req.body;
    try {
      const createdClass = await Class.createClass(newClass);
      res.status(201).json(createdClass);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating class");
    }
};

const addToClass = async (req, res) => {
  const { classID } = req.params;
  const { userID } = req.body;
  try {
      const updatedClass = await Class.addToClass(classID, userID);
      res.status(200).json(updatedClass);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
  }
};

const getClassUsers = async (req, res) => {
  const classID = req.params.classID;
  try {
    const classObj = await Class.getClassUsers(classID);
    if (!classObj || classObj.length === 0) {
        return res.status(404).send("Class not found or no users in this class");
    }
    res.json(classObj);
} catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving class users");
}
};

module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    addToClass,
    getClassUsers

};