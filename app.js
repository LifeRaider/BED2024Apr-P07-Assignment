const express = require("express");
const usersController = require("./controllers/usersController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const passport = require('passport')
const session = require('express-session')
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Serve static files
const staticMiddleware = express.static("public"); // Path to the public folder

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (origin == "http://localhost:5500" || origin == "http://localhost:3000"){
    // if (origin.includes("http://localhost:")){
      callback(null, true); // allow origin
    } else {
      callback(null, false); // disallow origin
    }
  },
  credentials: true
}));
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware); // Mount the static middleware
app.use(session({
  secret: 'lmfaowhatthe',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  }
}))
app.use(passport.initialize())
app.use(passport.session())
usersController.initializePassport(passport)


// Routes for requests
app.get("/", usersController.test); // Get all users
app.post("/CreateUsers", usersController.createUser); // Create user
app.post('/login', usersController.loginUser); // Login user
app.get('/currentUser', usersController.checkAuthenticated); // Check Authentification
app.delete('/logout', usersController.logout); // Logout user


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
  