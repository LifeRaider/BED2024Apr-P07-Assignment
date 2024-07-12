const sql = require("mssql");
const dbConfig = require("../dbConfig"); // Import dbConfig

class User {
    constructor(id, username, email, passwordHash, userType, parentId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.userType = userType;
        this.parentId = parentId;
    }

    static async getUserById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users Where userId LIKE @id`; // Parameterized query

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new User (
            result.recordset[0].userID,
            result.recordset[0].username,
            result.recordset[0].email,
            null,
            result.recordset[0].userType,
            result.recordset[0].parentId
            )
        : null; // Handle book not found
    }

    static async getUserByEmail(email) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users Where email LIKE @email`; // Parameterized query

        const request = connection.request();
        request.input("email", email);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new User (
            result.recordset[0].userID,
            result.recordset[0].username,
            result.recordset[0].email,
            result.recordset[0].passwordHash,
            result.recordset[0].userType,
            result.recordset[0].parentId
            )
        : null; // Handle book not found
    }

    static async createUser(newUserData, passwordHash) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DECLARE @newID VARCHAR(10);
                          SELECT @newID = UPPER(SUBSTRING(@userType, 1, 1)) + CAST(FORMAT(MAX(CAST(SUBSTRING(userID, 2, 4) AS INT)) + 1, '000') AS VARCHAR(4))
                          FROM Users where userID LIKE UPPER(SUBSTRING(@userType, 1, 1)) + '%';
                          IF @newID IS NULL SET @newID = UPPER(SUBSTRING(@userType, 1, 1)) + '001';
                          INSERT INTO Users OUTPUT inserted.userID VALUES (@newID, @username, @email, @passwordHash, @userType, @parentId);`;

        const request = connection.request();
        request.input("username", newUserData.username);
        request.input("email", newUserData.email);
        request.input("passwordHash", passwordHash);
        request.input("userType", newUserData.userType);
        request.input("parentID", null);

        const result = await request.query(sqlQuery);

        connection.close();

        // Retrieve the newly created user using its ID
        return this.getUserById(result.recordset[0].userID);
    }

    
}

module.exports = User;