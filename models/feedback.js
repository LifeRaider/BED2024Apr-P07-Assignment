const sql = require("mssql");
const dbConfig = require("../dbConfig"); // Import dbConfig

class Feedback {
    constructor(fbID, fbTitle, fbMsg, classID, postedBy, replyTo) {
        this.fbID = fbID;
        this.fbTitle = fbTitle;
        this.fbMsg = fbMsg;
        this.classID = classID;
        this.postedBy = postedBy;
        this.replyTo = replyTo;
    }

    static async getFeedbackById(fbID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Feedbacks WHERE fbID LIKE @fbID`; // Parameterized query

        const request = connection.request();
        request.input("fbID", fbID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new Feedback (
            result.recordset[0].fbID,
            result.recordset[0].fbTitle,
            result.recordset[0].fbMsg,
            result.recordset[0].classID,
            result.recordset[0].postedBy,
            result.recordset[0].replyTo
        )
        : null; // Handle class not found
    }

    static async getFeedbacksByClassID(classID) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Feedbacks WHERE classID LIKE @classID`; // Parameterized query

        const request = connection.request();
        request.input("classID", classID);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? result.recordset.map(i => {
            return new Feedback(
                i.fbID,
                i.fbTitle,
                i.fbMsg,
                i.classID,
                i.postedBy,
                i.replyTo
            );
        })
        : null;
    }

    static async createFeedback(newFeedbackData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DECLARE @newID VARCHAR(10);
                          SELECT @newID = 'F' + CAST(FORMAT(MAX(CAST(SUBSTRING(fbID, 2, 4) AS INT)) + 1, '000') AS VARCHAR(4))
                          FROM Feedbacks where fbID LIKE 'F%';
                          IF @newID IS NULL SET @newID = 'F001';
                          INSERT INTO Feedbacks OUTPUT inserted.fbID VALUES (@newID, @fbTitle, @fbMsg, @classID, @postedBy, @replyTo);`;
    
        const request = connection.request();
        request.input("fbID", newFeedbackData.fbID);
        request.input("fbTitle", newFeedbackData.fbTitle);
        request.input("fbMsg", newFeedbackData.fbMsg);
        request.input("classID", newFeedbackData.classID);
        request.input("postedBy", newFeedbackData.postedBy);
        request.input("replyTo", newFeedbackData.replyTo);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        // Retrieve the newly created class using its ID
        return this.getFeedbackById(result.recordset[0].fbID);
    }
}

module.exports = Feedback;