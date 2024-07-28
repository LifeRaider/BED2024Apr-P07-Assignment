const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Announcement {
    constructor(announcementID, announcementTitle, announcementDes, announcementDateTime, announcementCreator, announcementClass, editedBy, editedDateTime) {
        this.announcementID = announcementID;
        this.announcementTitle = announcementTitle;
        this.announcementDes = announcementDes;
        this.announcementDateTime = announcementDateTime;
        this.announcementCreator = announcementCreator;
        this.announcementClass = announcementClass;
        this.editedBy = editedBy;
        this.editedDateTime = editedDateTime;
    }

    static async getAllAnnouncements() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Announcements a
            LEFT JOIN Users u1 ON a.announcementCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
        `;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(row => ({
            ...new Announcement(
                row.announcementID,
                row.announcementTitle,
                row.announcementDes,
                row.announcementDateTime,
                row.announcementCreator,
                row.announcementClass,
                row.editedBy,
                row.editedDateTime
            ),
            creatorUsername: row.creatorUsername,
            editedByUsername: row.editedByUsername
        }));
    }

    static async getAnnouncementsByClassId(classID) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Announcements a
            LEFT JOIN Users u1 ON a.announcementCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
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
                row.announcementClass,
                row.editedBy,
                row.editedDateTime
            ),
            creatorUsername: row.creatorUsername,
            editedByUsername: row.editedByUsername
        }));
    }

    static async getAnnouncementById(announcementID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `
            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Announcements a
            LEFT JOIN Users u1 ON a.announcementCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
            WHERE a.announcementID = @announcementID
        `;

        const request = connection.request();
        request.input("announcementID", announcementID);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error('Announcement not found');
        }

        const row = result.recordset[0];
        return {
            ...new Announcement(
                row.announcementID,
                row.announcementTitle,
                row.announcementDes,
                row.announcementDateTime,
                row.announcementCreator,
                row.announcementClass,
                row.editedBy,
                row.editedDateTime
            ),
            creatorUsername: row.creatorUsername,
            editedByUsername: row.editedByUsername
        };
    }

    static async createAnnouncement(newAnnouncementData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
            DECLARE @newID VARCHAR(10);
            SELECT @newID = 'ANNO' + FORMAT(ISNULL(MAX(CAST(SUBSTRING(announcementID, 5, 5) AS INT)), 0) + 1, '00000') 
            FROM Announcements;
    
            INSERT INTO Announcements (announcementID, announcementTitle, announcementDes, announcementDateTime, announcementCreator, announcementClass)
            VALUES (@newID, @announcementTitle, @announcementDes, SYSUTCDATETIME(), @announcementCreator, @announcementClass);
    
            SELECT @newID AS newID;
        `;
    
        const request = connection.request();
        request.input("announcementTitle", newAnnouncementData.announcementTitle);
        request.input("announcementDes", newAnnouncementData.announcementDes);
        request.input("announcementCreator", newAnnouncementData.announcementCreator);
        request.input("announcementClass", newAnnouncementData.announcementClass);
    
        const result = await request.query(sqlQuery);
        const newID = result.recordset[0].newID;
    
        connection.close();
    
        return this.getAnnouncementById(newID);
    }

    static async updateAnnouncement(announcementID, updatedAnnouncementData) {
        const connection = await sql.connect(dbConfig);

        let updateFields = [];
        const request = connection.request();

        if (updatedAnnouncementData.announcementTitle !== undefined) {
            updateFields.push("announcementTitle = @announcementTitle");
            request.input("announcementTitle", updatedAnnouncementData.announcementTitle);
        }
        if (updatedAnnouncementData.announcementDes !== undefined) {
            updateFields.push("announcementDes = @announcementDes");
            request.input("announcementDes", updatedAnnouncementData.announcementDes);
        }
        if (updatedAnnouncementData.editedBy !== undefined) {
            updateFields.push("editedBy = @editedBy, editedDateTime = SYSUTCDATETIME()");
            request.input("editedBy", updatedAnnouncementData.editedBy);
        }
        if (updateFields.length === 0) {
            throw new Error("No fields to update");
        }

        const sqlQuery = `
            UPDATE Announcements
            SET ${updateFields.join(", ")}
            WHERE announcementID = @announcementID;

            SELECT a.*, u1.username as creatorUsername, u2.username as editedByUsername
            FROM Announcements a
            LEFT JOIN Users u1 ON a.announcementCreator = u1.userID
            LEFT JOIN Users u2 ON a.editedBy = u2.userID
            WHERE a.announcementID = @announcementID;
        `;

        request.input("announcementID", announcementID);

        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length === 0) {
            throw new Error('Announcement not found');
        }

        const updatedAnnouncement = result.recordset[0];
        return {
            ...new Announcement(
                updatedAnnouncement.announcementID,
                updatedAnnouncement.announcementTitle,
                updatedAnnouncement.announcementDes,
                updatedAnnouncement.announcementDateTime,
                updatedAnnouncement.announcementCreator,
                updatedAnnouncement.announcementClass,
                updatedAnnouncement.editedBy,
                updatedAnnouncement.editedDateTime
            ),
            creatorUsername: updatedAnnouncement.creatorUsername,
            editedByUsername: updatedAnnouncement.editedByUsername
        };
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