require('dotenv').config();
const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    // console.log('Verifying JWT for path:', req.path); // Log the path being accessed

    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: "Forbidden" });
        }

        // console.log('Decoded token:', decoded); // Log the decoded token

        // Check user role for authorization (replace with your logic)
        const authorizedRoles = {
            "/test": ["admin", "teacher", "parent", "student"],
            "/registerTeacher": ["admin"],
            "/classes(/.*)?": ["admin", "teacher"],
            "/userClasses/.*": ["admin", "teacher", "parent", "student"],
            "/feedback(/.*)?": ["admin", "teacher", "parent"],
            "/getAllUsers": ["admin"],
            "/logout": ["admin", "teacher", "parent", "student"],
            "/announcements(/.*)?": ["admin", "teacher", "parent", "student"],
            "/assignments(/.*)?": ["admin", "teacher", "parent", "student"],
        };

        const requestedEndpoint = req.path; // Use req.path instead of req.url
        const userType = decoded.userType;

        // console.log('Requested endpoint:', requestedEndpoint);
        // console.log('User type:', userType);

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
                return regex.test(requestedEndpoint) && roles.includes(userType);
            }
        );

        if (!authorizedRole) {
            console.log('User not authorized for this endpoint');
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decoded; // Attach decoded user information to the request object
        next();
    });
}

module.exports = verifyJWT;