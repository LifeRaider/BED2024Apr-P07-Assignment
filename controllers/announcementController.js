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

const getAnnouncementById = async (req, res) => {
    const announcementID = req.params.announcementID;
    try {
        const announcement = await Announcement.getAnnouncementById(announcementID);
        res.json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving announcement");
    }
}

const createAnnouncement = async (req, res) => {
    const newAnnouncement = req.body;

    try {
        const createdAnnouncement = await Announcement.createAnnouncement(newAnnouncement);
        res.status(201).json(createdAnnouncement); // Return the created announcement
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating announcement");
    }
}

const updateAnnouncement = async (req, res) => {
    const announcementID = req.params.announcementID;
    const updatedData = req.body;
    const editorID = req.user.id; // Assuming you have user information in the request

    try {
        const updatedAnnouncement = await Announcement.updateAnnouncement(announcementID, updatedData, editorID);
        res.json(updatedAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating announcement");
    }
}

const deleteAnnouncement = async (req, res) => {
    const { announcementID } = req.body;

    try {
        await Announcement.deleteAnnouncement(announcementID);
        res.status(200).send("Announcement deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting announcement");
    }
}

module.exports = {
    getAllAnnouncements,
    getAnnouncementsByClassId,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};