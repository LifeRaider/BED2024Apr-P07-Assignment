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
app.get("/users", usersController.getAllUsers);

app.get("/classes", classController.getAllClasses);
app.get("/classes/:classID", classController.getClassById);
app.post("/classes", classController.createClass);
app.put("/classes/:classID", classController.updateClass);
app.delete("/classes", classController.deleteClass);

app.put("/classes/:classID/add", classController.addToClass);
app.put("/classes/:classID/remove", classController.removeFromClass);
app.get("/classes/:classID/classUsers", classController.getClassUsers);

// Classes
app.put("/classes/:classID/add", classController.addToClass); // Add Student/Teacher to Class
app.put("/classes/:classID/remove", classController.removeFromClass); // Remove Student/Teacher from Class
app.get("/classes/:classID/classUsers", classController.getClassUsers); // Retrieve Class Students

// Announcement routes
app.get("/announcements", announcementController.getAllAnnouncements); // Get all annoucements
app.get('/announcements/class/:classID', announcementController.getAnnouncementsByClassId); // Get annoucement by class ID
app.get('/announcements/:announcementID', announcementController.getAnnouncementById);
app.post("/announcements", announcementController.createAnnouncement); // Create annoucement
app.put("/announcements/:announcementID", announcementController.updateAnnouncement); // Update annoucement
app.delete("/announcements", announcementController.deleteAnnouncement); // Delete annoucement

app.get("/assignments", assignmentController.getAllAssignments); // Get all assignments
app.get("/assignments/class/:classID", assignmentController.getAssignmentsByClassId); // Get assignments by class ID
app.get("/assignments/:assignmentID", assignmentController.getAssignmentById); // Get assignment by ID
app.post("/assignments", assignmentController.createAssignment); // Create assignment
app.put("/assignments/:assignmentID", assignmentController.updateAssignment); // Update assignment
app.delete("/assignments", assignmentController.deleteAssignment); // Delete assignment

app.post("/registerTeacher", usersController.register); // Create teacher
app.get("/userClasses/:userID", classController.getAllUserClass); // Get All User's Classes
app.get("/feedback/:classID", feedbackController.getFeedbacksByClassID); // Get feedbacks
app.post("/feedback", feedbackController.createFeedback); // Create feedback

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