const sql = require("mssql");
const dbConfig = require("../dbConfig"); // Import dbConfig

class Class {
    constructor(classID, className, classDes) {
        this.classID = classID;
        this.className = className;
        this.classDes = classDes;
    }

    static async getAllClasses() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Classes`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Class(row.classID, row.className, row.classDes)
        ); // Convert rows to Class objects
    }

    static async getClassById(classID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Classes WHERE classID LIKE @classID`; // Parameterized query

        const request = connection.request();
        request.input("classID", classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new Class (
            result.recordset[0].classID,
            result.recordset[0].className,
            result.recordset[0].classDes
        )
        : null; // Handle class not found
    }

    static async createClass(newClassData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DECLARE @newClassID VARCHAR(7);
                          SELECT @newClassID = 'Class' + FORMAT(ISNULL(MAX(CAST(SUBSTRING(classID, 6, 2) AS INT)), 0) + 1, '00')
                          FROM Classes WHERE classID LIKE 'Class%';
                          IF @newClassID IS NULL SET @newClassID = 'Class01';
                          
                          INSERT INTO Classes (classID, className, classDes) 
                          OUTPUT INSERTED.classID
                          VALUES (@newClassID, @className, @classDes);
                          
                          DECLARE @SQL NVARCHAR(MAX);
                          SET @SQL = N'CREATE TABLE ' + QUOTENAME(@newClassID) + ' (
                            UserId VARCHAR(4) PRIMARY KEY,
                            FOREIGN KEY (UserId) REFERENCES Users(userId)
                          );';
                          EXEC sp_executesql @SQL;`;
    
        const request = connection.request();
        request.input("className", newClassData.className);
        request.input("classDes", newClassData.classDes);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        // Retrieve the newly created class using its ID
        return this.getClassById(result.recordset[0].classID);
    }

    static async addToClass(classID, userID) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `  DECLARE @sql NVARCHAR(MAX);
                            SET @sql = N'INSERT INTO ' + QUOTENAME(@classID) + ' (userID) VALUES (@userID)';
                            EXEC sp_executesql @sql, N'@userID NVARCHAR(50)', @userID;`;
    
        const request = connection.request();
        request.input("classID", classID);
        request.input("userID", userID);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getClassUsers(classID);
    }

    static async removeFromClass(classID, userID) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `  DECLARE @sql NVARCHAR(MAX);
                            SET @sql = N'DELETE FROM ' + QUOTENAME(@classID) + ' WHERE userID = @userID';
                            EXEC sp_executesql @sql, N'@userID NVARCHAR(50)', @userID;`;
    
        const request = connection.request();
        request.input("classID", classID);
        request.input("userID", userID);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getClassUsers(classID);
    }

    static async getClassUsers(classID) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `
                DECLARE @sql NVARCHAR(MAX);
                SET @sql = N'SELECT u.userID, u.username, u.email, u.userType 
                            FROM ' + QUOTENAME(@classID) + ' c 
                            JOIN Users u ON c.userID = u.userID
                            ORDER BY 
                                CASE 
                                    WHEN u.userID LIKE ''T%'' THEN 1
                                    WHEN u.userID LIKE ''S%'' THEN 2
                                    ELSE 3
                                END';
                EXEC sp_executesql @sql;
            `;

            const request = connection.request();
            request.input("classID", sql.VarChar, classID);
            const result = await request.query(sqlQuery);

            return result.recordset;
        } finally {
            await connection.close();
        }
    }

    static async getAllUserClass(userID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `Select classID From Classes`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        let sqlQuery2 = ``;
        result.recordset.forEach(i => {
            sqlQuery2 += `SELECT '` + i.classID + `' AS ClassName
                          FROM ` + i.classID + `
                          WHERE UserId = '` + userID + `'
                          UNION ALL\n`
        });
        sqlQuery2 = sqlQuery2.trim().slice(0, -11);
        
        const result2 = await request.query(sqlQuery2);
        console.log(result2.recordset)

        connection.close();
        return result2.recordset;
    }

    static async updateClass(classID, updatedClassData) {
        const connection = await sql.connect(dbConfig);

        let updateFields = [];
        const request = connection.request();

        if (updatedClassData.className !== undefined) {
            updateFields.push("className = @className");
            request.input("className", updatedClassData.className);
        }
        if (updatedClassData.classDes !== undefined) {
            updateFields.push("classDes = @classDes");
            request.input("classDes", updatedClassData.classDes);
        }

        if (updateFields.length === 0) {
            throw new Error("No fields to update");
        }

        const sqlQuery = `
            UPDATE Classes
            SET ${updateFields.join(", ")}
            WHERE classID = @classID;
        `;

        request.input("classID", classID);

        await request.query(sqlQuery);

        connection.close();

        return this.getClassById(classID);
    }

    static async deleteClass(classID) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);

        try {
            await transaction.begin();

            // Delete related announcements
            await transaction.request()
                .input("classID", sql.VarChar, classID)
                .query("DELETE FROM Announcements WHERE announcementClass = @classID");

            // Delete related assignments
            await transaction.request()
                .input("classID", sql.VarChar, classID)
                .query("DELETE FROM Assignments WHERE assignmentClass = @classID");

            // Delete the class-specific table
            await transaction.request()
                .input("classID", sql.VarChar, classID)
                .query(`DROP TABLE ${classID}`);

            // Delete the class from the Classes table
            await transaction.request()
                .input("classID", sql.VarChar, classID)
                .query("DELETE FROM Classes WHERE classID = @classID");

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error("Error in deleteClass:", error);
            throw error;
        } finally {
            await connection.close();
        }
    }

    static async createSyllabus(classID, syllabusSubject, syllabusContent) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            INSERT INTO Syllabus (classID, syllabusSubject, syllabusContent)
            OUTPUT INSERTED.syllabusID
            VALUES (@classID, @syllabusContent);
        `;
        const request = connection.request();
        request.input("classID", sql.VarChar, classID);
        request.input("syllabusContent", sql.NVarChar, syllabusContent);
        request.input("syllabusSubject", sql.NVarChar, syllabusSubject);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset[0];
    }

    static async getSyllabusByClassId(classID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            SELECT * FROM Syllabus WHERE classID = @classID;
        `;
        const request = connection.request();
        request.input("classID", sql.VarChar, classID);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset; 
    }
}
    
module.exports = Class;