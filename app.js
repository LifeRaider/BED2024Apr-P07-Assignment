const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const usersController = require("./controllers/usersController");
const classController = require("./controllers/classController");
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
app.get("/", verifyJWT, usersController.test); // Get all users
// app.get("/getAllUsers", verifyJWT, usersController.getAllUsers); // Get all users
app.post("/register", usersController.register); // Create user
app.post('/login', usersController.login); // Login user
// app.get('/currentUser', usersController.checkAuthenticated); // Check Authentification
app.get("/classes", verifyJWT, classController.getAllClasses); // Get all classes


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