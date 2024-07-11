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

        const sqlQuery = `SELECT * FROM Announcements WHERE announcementClass = @classID`;

        const request = connection.request();
        request.input("classID", classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(row => 
            new Announcement(
                row.announcementID,
                row.announcementTitle,
                row.announcementDes,
                row.announcementDateTime,
                row.announcementCreator,
                row.announcementClass
            )
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
        `;

        const request = connection.request();
        request.input("announcementTitle", newAnnouncementData.announcementTitle);
        request.input("announcementDes", newAnnouncementData.announcementDes);
        request.input("announcementCreator", creatorID);
        request.input("announcementClass", newAnnouncementData.announcementClass);

        await request.query(sqlQuery);

        connection.close();

        return this.getAnnouncementsByClassId(newAnnouncementData.announcementClass);
    }
}

module.exports = Announcement;
