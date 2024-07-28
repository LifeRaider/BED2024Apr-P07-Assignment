USE BrainJamSystem
GO

-- Users Table
CREATE TABLE Users (
    userID VARCHAR(4) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    passwordHash VARCHAR(100) NOT NULL,
    userType VARCHAR(20) CHECK (userType IN ('admin', 'teacher', 'parent', 'student')),
    parentId VARCHAR(4),
    FOREIGN KEY (parentId) REFERENCES Users(userId)
);

-- Classes Table
CREATE TABLE Classes (
    classID VARCHAR(7) PRIMARY KEY,
    className VARCHAR(50) NOT NULL,
    classDes VARCHAR(200)
);

-- Announcements Table
CREATE TABLE Announcements (
    announcementID VARCHAR(9) PRIMARY KEY,
    announcementTitle VARCHAR(50) NOT NULL,
    announcementDes VARCHAR(200) NOT NULL,
    announcementDateTime DATETIME2 NOT NULL,
    announcementCreator VARCHAR(4) NOT NULL,
    announcementClass VARCHAR(7) NOT NULL,
    editedBy VARCHAR(4),
    editedDateTime DATETIME2,
    FOREIGN KEY (announcementCreator) REFERENCES Users(userId),
    FOREIGN KEY (announcementClass) REFERENCES Classes(classID),
    FOREIGN KEY (editedBy) REFERENCES Users(userId)
);

-- Assignments Table
CREATE TABLE Assignments (
    assignmentID VARCHAR(9) PRIMARY KEY,
    assignmentTitle VARCHAR(50) NOT NULL,
    assignmentDes VARCHAR(200) NOT NULL,
    assignmentPostDateTime DATETIME2 NOT NULL,
    assignmentDueDateTime DATETIME2 NOT NULL,
    assignmentCreator VARCHAR(4) NOT NULL,
    assignmentClass VARCHAR(7) NOT NULL,
    editedBy VARCHAR(4),
    editedDateTime DATETIME2,
    FOREIGN KEY (assignmentCreator) REFERENCES Users(userId),
    FOREIGN KEY (assignmentClass) REFERENCES Classes(classID),
    FOREIGN KEY (editedBy) REFERENCES Users(userId)
);

-- Feedbacks Table
CREATE TABLE Feedbacks (
    fbID VARCHAR(4) PRIMARY KEY,
    fbTitle VARCHAR(50) NOT NULL,
    fbMsg VARCHAR(500) NOT NULL,
    classID VARCHAR(7) NOT NULL,
    postedBy VARCHAR(4) NOT NULL,
    replyTo VARCHAR(4),
    FOREIGN KEY (classID) REFERENCES Classes(classID),
    FOREIGN KEY (postedBy) REFERENCES Users(userId),
    FOREIGN KEY (replyTo) REFERENCES Feedbacks(fbID)
);

-- Trigger for UTC time in Announcements
CREATE TRIGGER trg_Announcements_UTC
ON Announcements
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE a
    SET a.announcementDateTime = SYSUTCDATETIME(),
        a.editedDateTime = CASE WHEN a.editedBy IS NOT NULL THEN SYSUTCDATETIME() ELSE NULL END
    FROM Announcements a
    INNER JOIN inserted i ON a.announcementID = i.announcementID;
END;
GO

-- Trigger for UTC time in Assignments
CREATE TRIGGER trg_Assignments_UTC
ON Assignments
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE a
    SET a.assignmentPostDateTime = SYSUTCDATETIME(),
        a.editedDateTime = CASE WHEN a.editedBy IS NOT NULL THEN SYSUTCDATETIME() ELSE NULL END
    FROM Assignments a
    INNER JOIN inserted i ON a.assignmentID = i.assignmentID;
END;
GO

-- Insert sample data into Users table
INSERT INTO Users VALUES
('A001', 'Admin1', 'Admin1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'admin', NULL),
('P001', 'Parent1', 'Parent1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P002', 'Parent2', 'Parent2@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P003', 'Parent3', 'Parent3@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P004', 'Parent4', 'Parent4@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P005', 'Parent5', 'Parent5@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P006', 'Parent6', 'Parent6@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P007', 'Parent7', 'Parent7@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P008', 'Parent8', 'Parent8@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P009', 'Parent9', 'Parent9@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('P010', 'Parent10', 'Parent10@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', NULL),
('S001', 'Student1', 'Student1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P001'),
('S002', 'Student2', 'Student2@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P002'),
('S003', 'Student3', 'Student3@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P003'),
('S004', 'Student4', 'Student4@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P004'),
('S005', 'Student5', 'Student5@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P005'),
('S006', 'Student6', 'Student6@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P006'),
('S007', 'Student7', 'Student7@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P007'),
('S008', 'Student8', 'Student8@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P008'),
('S009', 'Student9', 'Student9@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P009'),
('S010', 'Student10', 'Student10@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'student', 'P010'),
('T001', 'Teacher1', 'Teacher1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', NULL),
('T002', 'Teacher2', 'Teacher2@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', NULL),
('T003', 'Teacher3', 'Teacher3@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', NULL),
('T004', 'Teacher4', 'Teacher4@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', NULL),
('T005', 'Teacher5', 'Teacher5@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', NULL),
('T006', 'Teacher6', 'Teacher6@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', NULL);

-- Insert sample data into Classes table
INSERT INTO Classes VALUES
('Class01', 'Math01', 'Happy class that learns about differentiation'),
('Class02', 'English01', 'Sad class that learns about grammar'),
('Class03', 'Chinese01', 'Angry class that learns about 我喜欢冰淇淋'),
('Class04', 'Science01', 'Depressed class that learns about mutation');

-- Insert sample data into Announcements table
INSERT INTO Announcements (announcementID, announcementTitle, announcementDes, announcementDateTime, announcementCreator, announcementClass)
VALUES
('ANNO00001', 'Math Quiz Next Week', 'Prepare for a quiz on chapters 3-5 next Tuesday', '2024-07-16 09:00:00', 'T001', 'Class01'),
('ANNO00002', 'English Essay Due Date', 'Remember to submit your comparative literature essay by Friday', '2024-07-18 14:30:00', 'T002', 'Class02'),
('ANNO00003', 'Chinese Cultural Presentation', 'Group presentations on Chinese festivals start next Monday', '2024-07-22 10:15:00', 'T003', 'Class03'),
('ANNO00004', 'Science Fair Projects', 'Science fair project proposals due in two weeks', '2024-07-25 11:00:00', 'T004', 'Class04'),
('ANNO00005', 'Physics Lab Report Deadline', 'Lab reports for the pendulum experiment due this Thursday', '2024-07-13 16:00:00', 'T005', 'Class01'),
('ANNO00006', 'Chemistry Safety Review', 'Mandatory lab safety review session this Wednesday after class', '2024-07-17 15:45:00', 'T006', 'Class04'),
('ANNO00007', 'Calculus Extra Help Sessions', 'Additional tutoring available for integration techniques', '2024-07-19 13:00:00', 'T001', 'Class01'),
('ANNO00008', 'Math Olympiad Sign-up', 'Interested students can sign up for the Math Olympiad by Friday', '2024-07-20 08:30:00', 'T001', 'Class01'),
('ANNO00009', 'English Book Club Meeting', 'Discussion on "To Kill a Mockingbird" this Thursday lunch', '2024-07-18 12:00:00', 'T002', 'Class02'),
('ANNO00010', 'Science Documentary Viewing', 'Watching "Cosmos: A Spacetime Odyssey" in class next Tuesday', '2024-07-23 14:00:00', 'T004', 'Class04');

-- Insert sample data into Assignments table
INSERT INTO Assignments (assignmentID, assignmentTitle, assignmentDes, assignmentPostDateTime, assignmentDueDateTime, assignmentCreator, assignmentClass)
VALUES
('ASGN00001', 'Algebra Problem Set', 'Complete exercises 1-20 on quadratic equations', '2024-07-12 09:00:00', '2024-07-19 23:59:59', 'T001', 'Class01'),
('ASGN00002', 'Shakespeare Essay', 'Write a 1000-word analysis on the themes in Hamlet', '2024-07-15 10:30:00', '2024-07-29 23:59:59', 'T002', 'Class02'),
('ASGN00003', 'Chinese Characters Practice', 'Write a short story using the new characters learned this week', '2024-07-16 14:00:00', '2024-07-23 23:59:59', 'T003', 'Class03'),
('ASGN00004', 'Ecosystem Project', 'Create a model of a local ecosystem and present findings', '2024-07-18 11:15:00', '2024-08-01 23:59:59', 'T004', 'Class04'),
('ASGN00005', 'Physics Problem Set', 'Solve problems 5-15 on circular motion', '2024-07-20 13:45:00', '2024-07-27 23:59:59', 'T005', 'Class01'),
('ASGN00006', 'Chemical Reactions Lab', 'Complete the lab report on observed chemical reactions', '2024-07-22 15:30:00', '2024-07-29 23:59:59', 'T006', 'Class04'),
('ASGN00007', 'Calculus Integration Methods', 'Solve the integration problems in Chapter 7', '2024-07-23 09:30:00', '2024-07-30 23:59:59', 'T001', 'Class01'),
('ASGN00008', 'Geometry Proofs', 'Complete the set of geometry proofs handed out in class', '2024-07-25 10:00:00', '2024-08-01 23:59:59', 'T001', 'Class01'),
('ASGN00009', 'Book Report', 'Write a report on a book of your choice from the reading list', '2024-07-26 14:15:00', '2024-08-09 23:59:59', 'T002', 'Class02'),
('ASGN00010', 'Science Experiment Design', 'Design an experiment to test a hypothesis of your choice', '2024-07-28 11:30:00', '2024-08-11 23:59:59', 'T004', 'Class04');

-- Create class-specific tables
EXEC('CREATE TABLE Class01 (userID VARCHAR(4) PRIMARY KEY, FOREIGN KEY (userID) REFERENCES Users(userID))');
EXEC('CREATE TABLE Class02 (userID VARCHAR(4) PRIMARY KEY, FOREIGN KEY (userID) REFERENCES Users(userID))');
EXEC('CREATE TABLE Class03 (userID VARCHAR(4) PRIMARY KEY, FOREIGN KEY (userID) REFERENCES Users(userID))');
EXEC('CREATE TABLE Class04 (userID VARCHAR(4) PRIMARY KEY, FOREIGN KEY (userID) REFERENCES Users(userID))');

-- Insert sample data into class-specific tables
INSERT INTO Class01 (userID) VALUES ('T001'), ('S001'), ('S002'), ('S003');
INSERT INTO Class02 (userID) VALUES ('T002'), ('S001'), ('S002'), ('S004');
INSERT INTO Class03 (userID) VALUES ('T003'), ('S003'), ('S004'), ('S005');
INSERT INTO Class04 (userID) VALUES ('T004'), ('S002'), ('S003'), ('S005');

-- Update existing data to UTC
UPDATE Announcements
SET announcementDateTime = SYSUTCDATETIME();

UPDATE Assignments
SET assignmentPostDateTime = SYSUTCDATETIME(),
    assignmentDueDateTime = DATEADD(day, 7, SYSUTCDATETIME());