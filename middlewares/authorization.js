require('dotenv').config();
const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Check user role for authorization (replace with your logic)
        const authorizedRoles = {
            "/test": ["admin", "teacher", "parent", "student"],
            "/registerTeacher": ["admin"],
            "/classes(/.*)?": ["admin"],
            "/userClasses/.*": ["admin", "teacher", "parent", "student"],
            "/feedback(/.*)?": ["admin", "teacher", "parent"],
            "/getAllUsers": ["admin"],
            "/logout": ["admin", "teacher", "parent", "student"],
            "/announcements$": ["admin", "teacher"], // Matches "/announcements"
            "/announcements/.*": ["admin", "teacher", "parent", "student"], // Matches "/announcements/" followed by anything
            "/announcements/:announcementID": ["admin", "teacher"], // Matches "/announcements/:announcementID"
            "/assignments$": ["admin", "teacher"], // Matches "/assignments"
            "/assignments/.*": ["admin", "teacher", "parent", "student"], // Matches "/assignments/" followed by anything
            "/assignments/:assignmentID": ["admin", "teacher"], // Matches "/assignments/:assignmentID"
            "/syllabus$": ["admin", "teacher", "parent", "student"], // Matches Syllabus
            "/syllabus/:syllabusID": ["admin", "teacher", "parent", "student"]// Matches "syllabus/:syllabusID"
        };

        const requestedEndpoint = req.url;
        const userType = decoded.userType;

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
                return regex.test(requestedEndpoint) && roles.includes(userType);
            }
        );

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decoded; // Attach decoded user information to the request object
        next();
    });
}

module.exports = verifyJWT;
