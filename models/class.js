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

    static async getClassUsers(classID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT u.userID, u.username, u.email, u.userType, u.parentID 
                        FROM ' + QUOTENAME(@classID) + ' c 
                        JOIN Users u ON c.userID = u.userID';
            EXEC sp_executesql @sql;
        `;

        const request = connection.request();
        request.input("classID", sql.VarChar, classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset;
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

    static async createSyllabus(newSyllabusData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DECLARE @newSyllabusID VARCHAR(9);
                          SELECT @newSyllabusID = 'SYL' + FORMAT(ISNULL(MAX(CAST(SUBSTRING(syllabusID, 4, 6) AS INT)), 0) + 1, '000000')
                          FROM Syllabuses WHERE syllabusID LIKE 'SYL%';
                          IF @newSyllabusID IS NULL SET @newSyllabusID = 'SYL000001';
                          
                          INSERT INTO Syllabuses (syllabusID, syllabusTitle, syllabusDes, syllabusPostDateTime, syllabusClass)
                          OUTPUT INSERTED.syllabusID
                          VALUES (@newSyllabusID, @syllabusTitle, @syllabusDes, @syllabusPostDateTime, @syllabusClass);`;
    
        const request = connection.request();
        request.input("syllabusTitle", sql.NVarChar, newSyllabusData.syllabusTitle);
        request.input("syllabusDes", sql.NVarChar, newSyllabusData.syllabusDes);
        request.input("syllabusPostDateTime", sql.DateTime, newSyllabusData.syllabusPostDateTime);
        request.input("syllabusClass", sql.VarChar, newSyllabusData.syllabusClass);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        // Retrieve the newly created syllabus using its ID
        return this.getSyllabusById(result.recordset[0].syllabusID);
    }

    static async getSyllabusById(classID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Syllabuses WHERE syllabusID = @classID`; // Parameterized query

        const request = connection.request();
        request.input("classID", sql.VarChar, classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0];
    }

}
    
module.exports = Class;