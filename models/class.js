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
}
    
module.exports = Class;