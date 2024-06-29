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

module.exports = {
    getAllClasses,
    getClassById,
    createClass
};