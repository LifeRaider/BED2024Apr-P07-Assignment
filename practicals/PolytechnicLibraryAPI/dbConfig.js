require('dotenv').config(); // This line loads the environment variables from the .env file

module.exports = {
    user: process.env.USER, // Use the USER environment variable
    password: process.env.PASSWORD, // Use the PASSWORD environment variable
    server: process.env.SERVER, // Use the SERVER environment variable
    database: process.env.DATABASE, // Use the DATABASE environment variable
    trustServerCertificate: true, // This can remain as is if you're okay with trusting the server certificate
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};