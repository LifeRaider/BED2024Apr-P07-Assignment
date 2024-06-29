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

module.exports = {
    getAllClasses
};