const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Assignment {
    constructor(assignmentID, assignmentTitle, assignmentDes, assignmentPostDateTime, assignmentDueDateTime, assignmentCreator, assignmentClass) {
        this.assignmentID = assignmentID;
        this.assignmentTitle = assignmentTitle;
        this.assignmentDes = assignmentDes;
        this.assignmentPostDateTime = assignmentPostDateTime;
        this.assignmentDueDateTime = assignmentDueDateTime;
        this.assignmentCreator = assignmentCreator;
        this.assignmentClass = assignmentClass;
    }

    static async getAllAssignments() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Assignments`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Assignment(row.assignmentID, row.assignmentTitle, row.assignmentDes, row.assignmentPostDateTime, row.assignmentDueDateTime, row.assignmentCreator, row.assignmentClass)
        );
    }

    static async getAssignmentsByClassId(classID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Assignments WHERE assignmentClass = @classID`;

        const request = connection.request();
        request.input("classID", classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(row => 
            new Assignment(
                row.assignmentID,
                row.assignmentTitle,
                row.assignmentDes,
                row.assignmentPostDateTime,
                row.assignmentDueDateTime,
                row.assignmentCreator,
                row.assignmentClass
            )
        );
    }

    static async getAssignmentById(assignmentID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Assignments WHERE assignmentID = @assignmentID`;

        const request = connection.request();
        request.input("assignmentID", assignmentID);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error('Assignment not found');
        }

        const row = result.recordset[0];
        return new Assignment(
            row.assignmentID,
            row.assignmentTitle,
            row.assignmentDes,
            row.assignmentPostDateTime,
            row.assignmentDueDateTime,
            row.assignmentCreator,
            row.assignmentClass
        );
    }

    static async createAssignment(newAssignmentData, creatorID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            DECLARE @newID VARCHAR(10);
            SELECT @newID = 'ASGN' + FORMAT(ISNULL(MAX(CAST(SUBSTRING(assignmentID, 5, 5) AS INT)), 0) + 1, '00000') 
            FROM Assignments;

            INSERT INTO Assignments (assignmentID, assignmentTitle, assignmentDes, assignmentPostDateTime, assignmentDueDateTime, assignmentCreator, assignmentClass)
            VALUES (@newID, @assignmentTitle, @assignmentDes, GETDATE(), @assignmentDueDateTime, @assignmentCreator, @assignmentClass);

            SELECT @newID AS newID;
        `;

        const request = connection.request();
        request.input("assignmentTitle", newAssignmentData.assignmentTitle);
        request.input("assignmentDes", newAssignmentData.assignmentDes);
        request.input("assignmentDueDateTime", newAssignmentData.assignmentDueDateTime);
        request.input("assignmentCreator", creatorID);
        request.input("assignmentClass", newAssignmentData.assignmentClass);

        const result = await request.query(sqlQuery);
        const newID = result.recordset[0].newID;

        connection.close();

        return this.getAssignmentById(newID);
    }

    static async updateAssignment(assignmentID, updatedAssignmentData) {
        const connection = await sql.connect(dbConfig);

        let updateFields = [];
        const request = connection.request();

        if (updatedAssignmentData.assignmentTitle !== undefined) {
            updateFields.push("assignmentTitle = @assignmentTitle");
            request.input("assignmentTitle", updatedAssignmentData.assignmentTitle);
        }
        if (updatedAssignmentData.assignmentDes !== undefined) {
            updateFields.push("assignmentDes = @assignmentDes");
            request.input("assignmentDes", updatedAssignmentData.assignmentDes);
        }
        if (updatedAssignmentData.assignmentDueDateTime !== undefined) {
            updateFields.push("assignmentDueDateTime = @assignmentDueDateTime");
            request.input("assignmentDueDateTime", updatedAssignmentData.assignmentDueDateTime);
        }
        if (updatedAssignmentData.assignmentClass !== undefined) {
            updateFields.push("assignmentClass = @assignmentClass");
            request.input("assignmentClass", updatedAssignmentData.assignmentClass);
        }

        if (updateFields.length === 0) {
            throw new Error("No fields to update");
        }

        const sqlQuery = `
            UPDATE Assignments
            SET ${updateFields.join(", ")}
            WHERE assignmentID = @assignmentID;
        `;

        request.input("assignmentID", assignmentID);

        await request.query(sqlQuery);

        connection.close();

        return this.getAssignmentById(assignmentID);
    }

    static async deleteAssignment(assignmentID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Assignments WHERE assignmentID = @assignmentID`;

        const request = connection.request();
        request.input("assignmentID", assignmentID);
        await request.query(sqlQuery);

        connection.close();
    }

}

module.exports = Assignment;