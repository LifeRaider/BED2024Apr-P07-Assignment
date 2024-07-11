const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); 
const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController");
const verifyJWT = require("./middlewares/authorization.js");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

// Routes
app.get("/books", verifyJWT, booksController.getAllBooks);
app.get("/books/:id", verifyJWT, booksController.getBookById);
app.put("/books/:id/availability", verifyJWT, booksController.updateBookAvailability);

app.post("/register", usersController.registerUser);
app.post("/login", usersController.login);

module.exports = app;

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