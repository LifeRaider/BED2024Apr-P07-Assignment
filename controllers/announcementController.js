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

    // Check if user information is available
    if (req.user && req.user.id) {
        newAnnouncement.announcementCreator = req.user.id;
    } else {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const createdAnnouncement = await Announcement.createAnnouncement(newAnnouncement);
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating announcement");
    }
}

const updateAnnouncement = async (req, res) => {
    const announcementID = req.params.announcementID;
    const updatedAnnouncement = req.body;

    // Check if user information is available
    if (req.user && req.user.id) {
        updatedAnnouncement.editedBy = req.user.id;
    } else {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const announcement = await Announcement.updateAnnouncement(announcementID, updatedAnnouncement);
        res.json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating announcement");
    }
}

const deleteAnnouncement = async (req, res) => {
    const { announcementID } = req.body;

    // You might want to add a check here to ensure the user has permission to delete the announcement

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