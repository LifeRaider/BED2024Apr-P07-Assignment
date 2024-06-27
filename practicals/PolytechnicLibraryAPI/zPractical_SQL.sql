USE PolyLibDB
GO

CREATE TABLE Users (
	user_id INT PRIMARY KEY,
	username VARCHAR(255) UNIQUE,
	passwordHash VARCHAR(255),
	role VARCHAR(20) CHECK (role IN ('member', 'librarian'))
);

CREATE TABLE Books (
	book_id INT PRIMARY KEY,
	title VARCHAR(255),
	author VARCHAR(255),
	availability CHAR(1) CHECK (availability IN ('Y','N'))
);