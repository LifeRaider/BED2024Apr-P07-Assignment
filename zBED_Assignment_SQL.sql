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

Create Table Classes (
	classID VARCHAR(7) PRIMARY KEY,
	className VARCHAR(15),
	classDes VARCHAR(200)
);

Insert Into Classes Values
('Class01', 'Math01', 'Happy classs that learns about differentiation'),
('Class02', 'Engish01', 'Sad classs that learns about grammer'),
('Class03', 'Chinese01', 'Angry classs that learns about 我喜欢冰淇淋'),
('Class04', 'Science01', 'Depressed classs that learns about mutation')

Create Table Class01 (
	UserId VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (UserId) REFERENCES Users(userId)
);

Create Table Class02 (
	UserId VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (UserId) REFERENCES Users(userId)
);

Create Table Class03 (
	UserId VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (UserId) REFERENCES Users(userId)
);

Create Table Class04 (
	UserId VARCHAR(4) PRIMARY KEY,
	FOREIGN KEY (UserId) REFERENCES Users(userId)
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

DROP TABLE Users;


DECLARE @newID VARCHAR(10);
DECLARE @userType VARCHAR(20) = 'admin';

SELECT @newID = UPPER(SUBSTRING(@userType, 1, 1)) + CAST(FORMAT(MAX(CAST(SUBSTRING(userID, 2, 4) AS INT)) + 1, '000') AS VARCHAR(4))
FROM Users where userID LIKE UPPER(SUBSTRING(@userType, 1, 1)) + '%';
IF @newID IS NULL SET @newID = UPPER(SUBSTRING(@userType, 1, 1)) + '001';
print @newID;