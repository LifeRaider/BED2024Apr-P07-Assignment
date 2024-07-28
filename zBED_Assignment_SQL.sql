USE BrainJamSystem
Go

Create Table Users (
	userID  VARCHAR(4) PRIMARY KEY,
	username VARCHAR(50),
	email VARCHAR(100) UNIQUE,
	passwordHash VARCHAR(100),
	userType VARCHAR(20) CHECK (userType IN ('admin', 'teacher', 'parent', 'student')),
	parentId VARCHAR(4) FOREIGN KEY (parentId) REFERENCES Users(userId)
);

Insert Into Users Values
('A001', 'Admin1', 'Admin1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'admin', Null),
('P001', 'Parent1', 'Parent1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P002', 'Parent2', 'Parent2@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P003', 'Parent3', 'Parent3@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P004', 'Parent4', 'Parent4@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P005', 'Parent5', 'Parent5@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P006', 'Parent6', 'Parent6@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P007', 'Parent7', 'Parent7@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P008', 'Parent8', 'Parent8@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P009', 'Parent9', 'Parent9@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
('P010', 'Parent10', 'Parent10@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'parent', Null),
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
('T001', 'Teacher1', 'Teacher1@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', Null),
('T002', 'Teacher2', 'Teacher2@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', Null),
('T003', 'Teacher3', 'Teacher3@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', Null),
('T004', 'Teacher4', 'Teacher4@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', Null),
('T005', 'Teacher5', 'Teacher5@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', Null),
('T006', 'Teacher6', 'Teacher6@example.com', '$2a$10$sAjfmmFH5wrJmZVxxSeFHOmH9rzWo71P8QKXXx6ZwubPRnTHesHCO', 'teacher', Null);

Create Table Classes (
	classID VARCHAR(7) PRIMARY KEY,
	className VARCHAR(15),
	classDes VARCHAR(200)
);

Insert Into Classes Values
('Class01', 'Math01', 'Happy classs that learns about differentiation'),
('Class02', 'Engish01', 'Sad classs that learns about grammer'),
('Class03', 'Chinese01', 'Angry classs that learns about 我喜欢冰淇淋'),
('Class04', 'Science01', 'Depressed classs that learns about mutation'),
('Class05', '1', '1'),
('Class06', '2', '2'),
('Class07', '3', '3')


Create Table Class01 (
	userID VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (userID) REFERENCES Users(userID)
);

Create Table Class02 (
	userID VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (userID) REFERENCES Users(userID)
);

Create Table Class03 (
	userID VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (userID) REFERENCES Users(userID)
);

Create Table Class04 (
	userID VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (userID) REFERENCES Users(userID)
);

-- Feedback

Create Table Feedbacks (
	fbID VARCHAR(4) PRIMARY KEY,
	fbTitle VARCHAR(50),
	fbMsg VARCHAR(500),
	classID VARCHAR(7) FOREIGN KEY (ClassID) REFERENCES Classes(ClassID),
	postedBy VARCHAR(4) FOREIGN KEY (PostedBy) REFERENCES Users(userId),
	replyTo VARCHAR(4) FOREIGN KEY (ReplyTo) REFERENCES Feedbacks(fbID),
);

-- Annoucements Table

CREATE TABLE Announcements (
    announcementID VARCHAR(9) PRIMARY KEY,
    announcementTitle VARCHAR(50),
    announcementDes VARCHAR(200),
    announcementDateTime DATETIME,
    announcementCreator VARCHAR(4),
    announcementClass VARCHAR(7),
    FOREIGN KEY (announcementCreator) REFERENCES Users(userId),
    FOREIGN KEY (announcementClass) REFERENCES Classes(classID)
);

INSERT INTO Announcements (announcementID, announcementTitle, announcementDes, announcementDateTime, announcementCreator, announcementClass)
VALUES
('ANNO00001', 'Math Quiz Next Week', 'Prepare for a quiz on chapters 3-5 next Tuesday', '2024-07-16 09:00:00', 'T001', 'Class01'),
('ANNO00002', 'English Essay Due Date', 'Remember to submit your comparative literature essay by Friday', '2024-07-18 14:30:00', 'T002', 'Class02'),
('ANNO00003', 'Chinese Cultural Presentation', 'Group presentations on Chinese festivals start next Monday', '2024-07-22 10:15:00', 'T003', 'Class03'),
('ANNO00004', 'Science Fair Projects', 'Science fair project proposals due in two weeks', '2024-07-25 11:00:00', 'T004', 'Class04'),
('ANNO00005', 'Physics Lab Report Deadline', 'Lab reports for the pendulum experiment due this Thursday', '2024-07-13 16:00:00', 'T005', 'Class05'),
('ANNO00006', 'Chemistry Safety Review', 'Mandatory lab safety review session this Wednesday after class', '2024-07-17 15:45:00', 'T006', 'Class06'),
('ANNO00007', 'Calculus Extra Help Sessions', 'Additional tutoring available for integration techniques', '2024-07-19 13:00:00', 'T001', 'Class07'),
('ANNO00008', 'Math Olympiad Sign-up', 'Interested students can sign up for the Math Olympiad by Friday', '2024-07-20 08:30:00', 'T001', 'Class01'),
('ANNO00009', 'English Book Club Meeting', 'Discussion on "To Kill a Mockingbird" this Thursday lunch', '2024-07-18 12:00:00', 'T002', 'Class02'),
('ANNO00010', 'Science Documentary Viewing', 'Watching "Cosmos: A Spacetime Odyssey" in class next Tuesday', '2024-07-23 14:00:00', 'T004', 'Class04');

-- Assignments Table

CREATE TABLE Assignments (
	assignmentID VARCHAR(9) PRIMARY KEY,
	assignmentTitle VARCHAR(50),
	assignmentDes VARCHAR(200),
	assignmentPostDateTime DATETIME,
	assignmentDueDateTime DATETIME,
	assignmentCreator VARCHAR(4) FOREIGN KEY (assignmentCreator) REFERENCES Users(userId),
	assignmentClass VARCHAR(7) FOREIGN KEY (assignmentClass) REFERENCES Classes(classID)
)

INSERT INTO Assignments (assignmentID, assignmentTitle, assignmentDes, assignmentPostDateTime, assignmentDueDateTime, assignmentCreator, assignmentClass)
VALUES
('ASGN00001', 'Algebra Problem Set', 'Complete exercises 1-20 on quadratic equations', '2024-07-12 09:00:00', '2024-07-19 23:59:59', 'T001', 'Class01'),
('ASGN00002', 'Shakespeare Essay', 'Write a 1000-word analysis on the themes in Hamlet', '2024-07-15 10:30:00', '2024-07-29 23:59:59', 'T002', 'Class02'),
('ASGN00003', 'Chinese Characters Practice', 'Write a short story using the new characters learned this week', '2024-07-16 14:00:00', '2024-07-23 23:59:59', 'T003', 'Class03'),
('ASGN00004', 'Ecosystem Project', 'Create a model of a local ecosystem and present findings', '2024-07-18 11:15:00', '2024-08-01 23:59:59', 'T004', 'Class04'),
('ASGN00005', 'Physics Problem Set', 'Solve problems 5-15 on circular motion', '2024-07-20 13:45:00', '2024-07-27 23:59:59', 'T005', 'Class05'),
('ASGN00006', 'Chemical Reactions Lab', 'Complete the lab report on observed chemical reactions', '2024-07-22 15:30:00', '2024-07-29 23:59:59', 'T006', 'Class06'),
('ASGN00007', 'Calculus Integration Methods', 'Solve the integration problems in Chapter 7', '2024-07-23 09:30:00', '2024-07-30 23:59:59', 'T001', 'Class07'),
('ASGN00008', 'Geometry Proofs', 'Complete the set of geometry proofs handed out in class', '2024-07-25 10:00:00', '2024-08-01 23:59:59', 'T001', 'Class01'),
('ASGN00009', 'Book Report', 'Write a report on a book of your choice from the reading list', '2024-07-26 14:15:00', '2024-08-09 23:59:59', 'T002', 'Class02'),
('ASGN00010', 'Science Experiment Design', 'Design an experiment to test a hypothesis of your choice', '2024-07-28 11:30:00', '2024-08-11 23:59:59', 'T004', 'Class04');


DECLARE @username VARCHAR(50) = 'hi';
DECLARE @email VARCHAR(100) = 'hi@hi.com';
DECLARE @passwordHash VARCHAR(100) = '$2a$10$EDbhsuYPeUh1BkUhOxogFOmcdtEpCSz.bYywzWyCk4rsdzb2F2RWq';
DECLARE @userType VARCHAR(20) = 'student';
DECLARE @parentId VARCHAR(4) = null;
DECLARE @newID VARCHAR(10);

SELECT @newID = UPPER(SUBSTRING(@userType, 1, 1)) + CAST(FORMAT(MAX(CAST(SUBSTRING(userID, 2, 4) AS INT)) + 1, '000') AS VARCHAR(4))
FROM Users where userID LIKE UPPER(SUBSTRING(@userType, 1, 1)) + '%';
IF @newID IS NULL SET @newID = UPPER(SUBSTRING(@userType, 1, 1)) + '001';
print @newID;
INSERT INTO Users OUTPUT inserted.userID VALUES (@newID, @username, @email, @passwordHash, @userType, @parentId);


DELETE FROM Users
WHERE CAST(SUBSTRING(userID, 2, 4) AS INT) > 10;


Select * FROM Users
WHERE CAST(SUBSTRING(userID, 2, 4) AS INT) > 10;



INSERT INTO Users OUTPUT inserted.userID VALUES ('1000', @username, @email, @passwordHash, @userType, @parentId);


Select classID From Classes

Select * From Class01


DECLARE @fbTitle VARCHAR(50) = 'hi';
DECLARE @fbMsg VARCHAR(500) = 'hihihi';
DECLARE @classID VARCHAR(7) = 'Class01';
DECLARE @postedBy VARCHAR(4) = 'P001';
DECLARE @replyTo VARCHAR(4) = null;
DECLARE @newnewID VARCHAR(4);


SELECT @newnewID = 'F' + CAST(FORMAT(MAX(CAST(SUBSTRING(fbID, 2, 4) AS INT)) + 1, '000') AS VARCHAR(4))
FROM Feedbacks where fbID LIKE 'F%';
IF @newnewID IS NULL SET @newnewID = 'F001';
INSERT INTO Feedbacks OUTPUT inserted.fbID VALUES (@newnewID, @fbTitle, @fbMsg, @classID, @postedBy, @replyTo);

Select * From Feedbacks

SELECT * FROM Feedbacks WHERE classID LIKE 'Class01'

SELECT * FROM Feedbacks WHERE fbId LIKE 'F001'

CREATE TABLE Syllabus (
    syllabusID VARCHAR(4) PRIMARY KEY,
    classID VARCHAR(7) FOREIGN KEY REFERENCES Classes(classID),
	syllabusSubject NVARCHAR(MAX),
    syllabusContent NVARCHAR(MAX)
);

INSERT INTO Syllabus VALUES
('S001', 'Class01', 'Mathematics', 'Differentiation and Integration topics'),
('S002', 'Class02', 'English', 'Grammar and Literature topics');
