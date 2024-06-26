const sql = require("mssql");
const dbConfig = require("../dbConfig"); // Import dbConfig
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt");


class User {
    constructor(id, username, email, password, userType, parentId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.parentId = parentId;
    }

    static async getAllUsers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users Where parentId IS NOT NULL`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new User(row.userId, row.username, row.email, row.userType, row.parentId)
        ); // Convert rows to User objects
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
            result.recordset[0].password,
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
            result.recordset[0].password,
            result.recordset[0].userType,
            result.recordset[0].parentId
            )
        : null; // Handle book not found
    }

    static async createUser(newUserData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DECLARE @newID VARCHAR(10);
                          SELECT @newID = UPPER(SUBSTRING(@userType, 1, 1)) + CAST(FORMAT(MAX(CAST(SUBSTRING(userID, 2, 4) AS INT)) + 1, '000') AS VARCHAR(4))
                          FROM Users where userID LIKE 'S%';
                          INSERT INTO Users OUTPUT inserted.userID VALUES (@newID, @username, @email, @password, @userType, @parentId);`;

        const request = connection.request();
        request.input("userName", newUserData.username);
        request.input("email", newUserData.email);
        const hashedPassword = await bcrypt.hash(newUserData.password, 10)
        request.input("password", hashedPassword);
        request.input("userType", newUserData.userType);
        request.input("parentID", null);
        // request.input("parentID", newUserData.childEmail ? await this.getUserIdByEmail(newUserData.childEmail) : null);
        
        const result = await request.query(sqlQuery);
        // Retrieve the newly created user using its ID
        return this.getUserById(result.recordset[0].userID);
    }

    static initializePassport(passport) {
        const authenticateUser = async (email, password, done) => {
            const user = await this.getUserByEmail(email);
            if (user == null) {
                console.log('No user with that email')
                return done(null, false, { message: 'No user with that email' });
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    console.log('Password incorrect')
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (error) {
                console.log(error)
                return done(error);
            }
        }

        // passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => authenticateUser(email, password)));
        passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => {
            return done(null, this.getUserById(id));
        });
    }
}

module.exports = User;