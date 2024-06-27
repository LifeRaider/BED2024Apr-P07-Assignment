require('dotenv').config()

module.exports = {
  user: process.env.USER, // Replace with your SQL Server login username
  password: process.env.PASSWORD, // Replace with your SQL Server login password
  server: process.env.SERVER,
  database: process.env.DATABASE,
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};