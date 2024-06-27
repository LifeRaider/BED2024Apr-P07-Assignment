const sql = require("mssql");
const dbConfig = require("../dbConfig"); // Import dbConfig

class User {
    constructor(id, username, passwordHash, role) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
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
            result.recordset[0].passwordHash,
            result.recordset[0].role,
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
            result.recordset[0].id,
            result.recordset[0].username,
            result.recordset[0].email
            )
        : null; // Handle book not found
    }

    static async createUser(username, hashedPassword, role) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS id;`;

        const request = connection.request();
        request.input("username", username);
        request.input("passwordHash", hashedPassword);
        request.input("role", role);

        const result = await request.query(sqlQuery);

        connection.close();

        // Retrieve the newly created user using its ID
        return this.getUserById(result.recordset[0].id);
    }
}
module.exports = User;