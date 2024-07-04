const sql = require("mssql");
const dbConfig = require("../dbConfig"); // Import dbConfig

class User {
    constructor(id, username, passwordHash, role) {
        this.id = id;
        this.username = username;
        this.role = role;

    }

    static async getUserByUsername(username) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users Where username LIKE @username`; // Parameterized query

        const request = connection.request();
        request.input("username", username);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new User (
            result.recordset[0].user_id,
            result.recordset[0].username,
            result.recordset[0].role
            )
        : null; // Handle book not found
    }

    static async getUserById(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Users WHERE user_id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset[0]
        ? new User (
            result.recordset[0].user_id,
            result.recordset[0].username,
            result.recordset[0].passwordHash,
            result.recordset[0].role
            )
        : null; // Handle user not found
    }

    static async createUser(username, hashedPassword, role) {
        const connection = await sql.connect(dbConfig);
    
        // Step 1: Count the number of existing users to determine the next user_id
        const countQuery = `SELECT COUNT(*) AS count FROM Users;`;
        const countResult = await connection.request().query(countQuery);
        const userCount = countResult.recordset[0].count + 1; // Add 1 for the new user
    
        // Step 2: Use the userCount directly as the user_id without padding
        const userId = userCount.toString(); // Conversion to string without padding
    
        // Step 3: Insert the new user with the user_id
        const sqlQuery = `INSERT INTO Users (user_id, username, passwordHash, role) VALUES (@userId, @username, @passwordHash, @role);`;
        const request = connection.request();
        request.input("userId", userId);
        request.input("username", username);
        request.input("passwordHash", hashedPassword);
        request.input("role", role);

        await request.query(sqlQuery);

        connection.close();

        // Since userId is manually set, directly return the user using getUserById
        return this.getUserById(userId);
    }
}
module.exports = User;