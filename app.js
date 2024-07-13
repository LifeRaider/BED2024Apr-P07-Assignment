const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const usersController = require("./controllers/usersController");
const classController = require("./controllers/classController");
const announcementController = require("./controllers/announcementController.js");
const verifyJWT = require("./middlewares/authorization.js");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public"); // Path to the public folder

app.use(cors());
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware); // Mount the static middleware

// Routes for requests
app.get("/test", verifyJWT, usersController.test); // Get all users
// app.get("/getAllUsers", verifyJWT, usersController.getAllUsers); // Get all users
app.post("/register", usersController.register); // Create user
app.post('/login', usersController.login); // Login user
// app.get('/currentUser', usersController.checkAuthenticated); // Check Authentification
app.get("/classes", verifyJWT, classController.getAllClasses); // Get all classes
app.get("/classes/:classID", verifyJWT, classController.getClassById); // Get class by ID
app.post("/classes", verifyJWT, classController.createClass); // Create class

app.put("/classes/:classID/add", verifyJWT, classController.addToClass); // Add Student/Teacher to Class
app.get("/classes/:classID/classUsers", verifyJWT, classController.getClassUsers); // Retrieve Class Students

app.get("/announcements", verifyJWT, announcementController.getAllAnnouncements); // Get all annoucements
app.get('/announcements/class/:classID', verifyJWT, announcementController.getAnnouncementsByClassId); // Get annoucement by class ID
app.get('/announcements/:announcementID', verifyJWT, announcementController.getAnnouncementById);
app.post("/announcements", verifyJWT, announcementController.createAnnouncement); // Create annoucement
app.delete("/announcements/:announcementID", verifyJWT, announcementController.deleteAnnouncement); // Delete annoucement

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