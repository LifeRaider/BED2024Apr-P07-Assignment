const Announcement = require("../models/announcement");

const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.getAllAnnouncements();
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving announcements");
    }
}

const getAnnouncementsByClassId = async (req, res) => {
    const classID = req.params.classID;
    try {
        const announcements = await Announcement.getAnnouncementsByClassId(classID);
        if (announcements.length === 0) {
            return res.status(404).send("No announcements found for this class");
        }
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving announcements");
    }
}

const createAnnouncement = async (req, res) => {
    const newAnnouncement = req.body;
    const creatorID = req.user.userID; // Assuming user ID is stored in req.user.id after JWT validation

    try {
        const createdAnnouncements = await Announcement.createAnnouncement(newAnnouncement, creatorID);
        res.status(201).json(createdAnnouncements);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating announcement");
    }
}

module.exports = {
    getAllAnnouncements,
    getAnnouncementsByClassId,
    createAnnouncement
};