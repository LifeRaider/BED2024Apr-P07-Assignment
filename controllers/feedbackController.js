const Feedback = require("../models/feedback");

const getFeedbacksByClassID = async (req, res) => {
    const classID = req.params.classID;
    try {
        const feedbacks = await Feedback.getFeedbacksByClassID(classID);
        console.log()
        if (!feedbacks) {
            return res.status(404).send("Feedbacks not found");
        }
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving Feedbacks");
    }
};

const createFeedback = async (req, res) => {
    const newFeedback = req.body;
    try {
        const createdFeedback = await Feedback.createFeedback(newFeedback);
        res.status(201).json(createdFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating Feedback");
    }
};

module.exports = {
    getFeedbacksByClassID,
    createFeedback
  };