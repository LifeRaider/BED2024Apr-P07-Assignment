module.exports = {
    user: "BED_Assignment_User", // Replace with your SQL Server login username
    password: "1234", // Replace with your SQL Server login password
    server: "localhost",
    database: "BrainJamSystem",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };
