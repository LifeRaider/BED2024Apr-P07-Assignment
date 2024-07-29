const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const usersController = require("./controllers/usersController");
const classController = require("./controllers/classController");
const assignmentController = require("./controllers/assignmentController");
const announcementController = require("./controllers/announcementController.js");
const feedbackController = require("./controllers/feedbackController");
const verifyJWT = require("./middlewares/authorization.js");

const app = express();
const port = process.env.PORT || 3000;

const staticMiddleware = express.static("public");

app.use(cors({ origin: '*' }));

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get("/test", verifyJWT, usersController.test);
app.post("/register", usersController.register);
app.post('/login', usersController.login);
app.put('/editUser', verifyJWT, usersController.editUser);
app.delete('/deleteUser', verifyJWT, usersController.deleteUser);
app.get("/users", usersController.getAllUsers);
app.get("/usersInfo", verifyJWT, usersController.getUserById);

app.get("/classes", classController.getAllClasses);
app.get("/classes/:classID", classController.getClassById);
app.post("/classes", classController.createClass);
app.put("/classes/:classID", classController.updateClass);
app.delete("/classes", classController.deleteClass);

// Classes
app.put("/classes/:classID/add", classController.addToClass); // Add Student/Teacher to Class
app.put("/classes/:classID/remove", classController.removeFromClass); // Remove Student/Teacher from Class
app.get("/classes/:classID/classUsers", classController.getClassUsers); // Retrieve Class Students

// Announcement routes
app.get("/announcements", announcementController.getAllAnnouncements);
app.get('/announcements/class/:classID', announcementController.getAnnouncementsByClassId);
app.get('/announcements/:announcementID', announcementController.getAnnouncementById);
app.post("/announcements", verifyJWT, announcementController.createAnnouncement);  // Add verifyJWT here
app.put("/announcements/:announcementID", verifyJWT, announcementController.updateAnnouncement);  // And here
app.delete("/announcements", verifyJWT, announcementController.deleteAnnouncement);  // And here

app.get("/assignments", assignmentController.getAllAssignments);
app.get("/assignments/class/:classID", assignmentController.getAssignmentsByClassId);
app.get("/assignments/:assignmentID", assignmentController.getAssignmentById);
app.post("/assignments", verifyJWT, assignmentController.createAssignment);
app.put("/assignments/:assignmentID", verifyJWT, assignmentController.updateAssignment);
app.delete("/assignments", verifyJWT, assignmentController.deleteAssignment);

app.post("/registerTeacher", verifyJWT, usersController.register);
app.get("/userClasses/:userID", verifyJWT, classController.getAllUserClass);
app.get("/feedback/:classID", verifyJWT, feedbackController.getFeedbacksByClassID);
app.post("/feedback", verifyJWT, feedbackController.createFeedback);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});
  
// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});