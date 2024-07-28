const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Assignment {
    constructor(assignmentID, assignmentTitle, assignmentDes, assignmentPostDateTime, assignmentDueDateTime, assignmentCreator, assignmentClass, editedBy, editedDateTime) {
        this.assignmentID = assignmentID;
        this.assignmentTitle = assignmentTitle;
        this.assignmentDes = assignmentDes;
        this.assignmentPostDateTime = assignmentPostDateTime;
        this.assignmentDueDateTime = assignmentDueDateTime;
        this.assignmentCreator = assignmentCreator;
        this.assignmentClass = assignmentClass;
        this.editedBy = editedBy;
        this.editedDateTime = editedDateTime;
    }

    static async getAllAssignments() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Assignments a
            LEFT JOIN Users u1 ON a.assignmentCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
        `;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(row => ({
            ...new Assignment(
                row.assignmentID,
                row.assignmentTitle,
                row.assignmentDes,
                row.assignmentPostDateTime,
                row.assignmentDueDateTime,
                row.assignmentCreator,
                row.assignmentClass,
                row.editedBy,
                row.editedDateTime
            ),
            creatorUsername: row.creatorUsername,
            editedByUsername: row.editedByUsername
        }));
    }

    static async getAssignmentsByClassId(classID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Assignments a
            LEFT JOIN Users u1 ON a.assignmentCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
            WHERE a.assignmentClass = @classID
        `;

        const request = connection.request();
        request.input("classID", classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(row => ({
            ...new Assignment(
                row.assignmentID,
                row.assignmentTitle,
                row.assignmentDes,
                row.assignmentPostDateTime,
                row.assignmentDueDateTime,
                row.assignmentCreator,
                row.assignmentClass,
                row.editedBy,
                row.editedDateTime
            ),
            creatorUsername: row.creatorUsername,
            editedByUsername: row.editedByUsername
        }));
    }

    static async getAssignmentById(assignmentID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Assignments a
            LEFT JOIN Users u1 ON a.assignmentCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
            WHERE a.assignmentID = @assignmentID
        `;

        const request = connection.request();
        request.input("assignmentID", assignmentID);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error('Assignment not found');
        }

        const row = result.recordset[0];
        return {
            ...new Assignment(
                row.assignmentID,
                row.assignmentTitle,
                row.assignmentDes,
                row.assignmentPostDateTime,
                row.assignmentDueDateTime,
                row.assignmentCreator,
                row.assignmentClass,
                row.editedBy,
                row.editedDateTime
            ),
            creatorUsername: row.creatorUsername,
            editedByUsername: row.editedByUsername
        };
    }

    static async createAssignment(newAssignmentData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            DECLARE @newID VARCHAR(10);
            SELECT @newID = 'ASGN' + FORMAT(ISNULL(MAX(CAST(SUBSTRING(assignmentID, 5, 5) AS INT)), 0) + 1, '00000') 
            FROM Assignments;

            INSERT INTO Assignments (assignmentID, assignmentTitle, assignmentDes, assignmentPostDateTime, assignmentDueDateTime, assignmentCreator, assignmentClass)
            VALUES (@newID, @assignmentTitle, @assignmentDes, SYSUTCDATETIME(), @assignmentDueDateTime, @assignmentCreator, @assignmentClass);

            SELECT @newID AS newID;
        `;

        const request = connection.request();
        request.input("assignmentTitle", newAssignmentData.assignmentTitle);
        request.input("assignmentDes", newAssignmentData.assignmentDes);
        request.input("assignmentDueDateTime", newAssignmentData.assignmentDueDateTime);
        request.input("assignmentCreator", newAssignmentData.creatorID);
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
        if (updatedAssignmentData.editedBy !== undefined) {
            updateFields.push("editedBy = @editedBy, editedDateTime = SYSUTCDATETIME()");
            request.input("editedBy", updatedAssignmentData.editedBy);
        }

        if (updateFields.length === 0) {
            throw new Error("No fields to update");
        }

        const sqlQuery = `
            UPDATE Assignments
            SET ${updateFields.join(", ")}
            WHERE assignmentID = @assignmentID;

            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Assignments a
            LEFT JOIN Users u1 ON a.assignmentCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
            WHERE a.assignmentID = @assignmentID;
        `;

        request.input("assignmentID", assignmentID);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error('Assignment not found');
        }

        const updatedAssignment = result.recordset[0];
        return {
            ...new Assignment(
                updatedAssignment.assignmentID,
                updatedAssignment.assignmentTitle,
                updatedAssignment.assignmentDes,
                updatedAssignment.assignmentPostDateTime,
                updatedAssignment.assignmentDueDateTime,
                updatedAssignment.assignmentCreator,
                updatedAssignment.assignmentClass,
                updatedAssignment.editedBy,
                updatedAssignment.editedDateTime
            ),
            creatorUsername: updatedAssignment.creatorUsername,
            editedByUsername: updatedAssignment.editedByUsername
        };
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