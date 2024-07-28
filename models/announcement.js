const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Announcement {
    constructor(announcementID, announcementTitle, announcementDes, announcementDateTime, announcementCreator, announcementClass) {
        this.announcementID = announcementID;
        this.announcementTitle = announcementTitle;
        this.announcementDes = announcementDes;
        this.announcementDateTime = announcementDateTime;
        this.announcementCreator = announcementCreator;
        this.announcementClass = announcementClass;
    }

    static async getAllAnnouncements() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Announcements`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Announcement(row.announcementID, row.announcementTitle, row.announcementDes, row.announcementDateTime, row.announcementCreator, row.announcementClass)
        );
    }

    static async getAnnouncementsByClassId(classID) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
            SELECT a.*, u.username as creatorUsername
            FROM Announcements a
            JOIN Users u ON a.announcementCreator = u.userID
            WHERE a.announcementClass = @classID
        `;
    
        const request = connection.request();
        request.input("classID", classID);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(row => ({
            ...new Announcement(
                row.announcementID,
                row.announcementTitle,
                row.announcementDes,
                row.announcementDateTime,
                row.announcementCreator,
                row.announcementClass
            ),
            creatorUsername: row.creatorUsername
        }));
    }

    static async getAnnouncementById(announcementID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Announcements WHERE announcementID = @announcementID`;

        const request = connection.request();
        request.input("announcementID", announcementID);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error('Announcement not found');
        }

        const row = result.recordset[0];
        return new Announcement(
            row.announcementID,
            row.announcementTitle,
            row.announcementDes,
            row.announcementDateTime,
            row.announcementCreator,
            row.announcementClass
        );
    }

    static async createAnnouncement(newAnnouncementData, creatorID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            DECLARE @newID VARCHAR(10);
            SELECT @newID = 'ANNO' + FORMAT(ISNULL(MAX(CAST(SUBSTRING(announcementID, 5, 5) AS INT)), 0) + 1, '00000') 
            FROM Announcements;

            INSERT INTO Announcements (announcementID, announcementTitle, announcementDes, announcementDateTime, announcementCreator, announcementClass)
            VALUES (@newID, @announcementTitle, @announcementDes, GETDATE(), @announcementCreator, @announcementClass);

            SELECT @newID AS newID;
        `;

        const request = connection.request();
        request.input("announcementTitle", newAnnouncementData.announcementTitle);
        request.input("announcementDes", newAnnouncementData.announcementDes);
        request.input("announcementCreator", creatorID);
        request.input("announcementClass", newAnnouncementData.announcementClass);

        const result = await request.query(sqlQuery);
        const newID = result.recordset[0].newID;

        connection.close();

        return this.getAnnouncementById(newID);
    }

    static async updateAnnouncement(announcementID, updatedData, editorID) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
            UPDATE Announcements
            SET announcementTitle = @announcementTitle,
                announcementDes = @announcementDes,
                editedBy = @editedBy,
                editedDateTime = GETDATE()
            OUTPUT inserted.*
            WHERE announcementID = @announcementID;
    
            SELECT username as editedByUsername FROM Users WHERE userID = @editedBy;
        `;
    
        const request = connection.request();
        request.input("announcementID", announcementID);
        request.input("announcementTitle", updatedData.announcementTitle);
        request.input("announcementDes", updatedData.announcementDes);
        request.input("editedBy", editorID);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        const updatedAnnouncement = result.recordsets[0][0];
        updatedAnnouncement.editedByUsername = result.recordsets[1][0].editedByUsername;
    
        return updatedAnnouncement;
    }

    static async deleteAnnouncement(announcementID) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
            DELETE FROM Announcements
            WHERE announcementID = @announcementID
        `;
    
        const request = connection.request();
        request.input("announcementID", announcementID);
    
        await request.query(sqlQuery);
    
        connection.close();
    }
    
}

module.exports = Announcement;
