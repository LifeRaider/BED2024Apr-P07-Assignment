const Assignment = require("../models/assignment");

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.getAllAssignments();
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving assignments");
    }
}

const getAssignmentsByClassId = async (req, res) => {
    const classID = req.params.classID;
    try {
        const assignments = await Assignment.getAssignmentsByClassId(classID);
        if (assignments.length === 0) {
            return res.status(404).send("No assignments found for this class");
        }
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving assignments");
    }
}

const getAssignmentById = async (req, res) => { // Correct function name
    const assignmentID = req.params.assignmentID;
    try {
        const assignment = await Assignment.getAssignmentById(assignmentID);
        res.json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving assignment");
    }
}

const createAssignment = async (req, res) => {
    const newAssignment = req.body;
    const creatorID = req.user.id; // Correct field name

    try {
        const createdAssignment = await Assignment.createAssignment(newAssignment, creatorID);
        res.status(201).json(createdAssignment); // Return the created assignment
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating assignment");
    }
}

const updateAssignment = async (req, res) => {
    const assignmentID = req.params.assignmentID;
    const updatedAssignment = req.body;

    try {
        const assignment = await Assignment.updateAssignment(assignmentID, updatedAssignment);
        res.json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating assignment");
    }
}

const deleteAssignment = async (req, res) => {
    const assignmentID = req.body.assignmentID;
    try {
        await Assignment.deleteAssignment(assignmentID);
        res.status(200).send("Assignment deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting assignment");
    }
}

module.exports = {
    getAllAssignments,
    getAssignmentsByClassId,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
};