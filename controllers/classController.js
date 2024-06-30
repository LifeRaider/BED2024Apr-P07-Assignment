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

// Add Student / Teacher to Class - PUT
const addToClass = async (req, res) => {
  const { classID } = req.params;
  const { userID, role } = req.body;

  if (!userID || !role) {
    return res.status(400).send({ message: "userID and role are required" });
  }

  try {
    const pool = await sql.connect(dbConfig);

    let query;
    if (role === "student") {
      query = "INSERT INTO ClassStudents (classID, studentID) VALUES (@classID, @userID)";
    } else if (role === "teacher") {
      query = "INSERT INTO ClassTeachers (classID, teacherID) VALUES (@classID, @userID)";
    } else {
      return res.status(400).send({ message: "Invalid role" });
    }

    await pool.request()
      .input("classID", sql.Int, classID)
      .input("userID", sql.Int, userID)
      .query(query);

    res.status(200).send({ message: "User added to class successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Retrieve Class info - GET
const getClassInfo = async (req, res) => {
  const { classID } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    const studentsQuery = `
      SELECT s.* FROM Students s
      JOIN ClassStudents cs ON s.studentID = cs.studentID
      WHERE cs.classID = @classID
    `;
    const teachersQuery = `
      SELECT t.* FROM Teachers t
      JOIN ClassTeachers ct ON t.teacherID = ct.teacherID
      WHERE ct.classID = @classID
    `;

    const students = await pool.request()
      .input("classID", sql.Int, classID)
      .query(studentsQuery);

    const teachers = await pool.request()
      .input("classID", sql.Int, classID)
      .query(teachersQuery);

    res.status(200).send({
      students: students.recordset,
      teachers: teachers.recordset
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    addToClass,
    getClassInfo

};