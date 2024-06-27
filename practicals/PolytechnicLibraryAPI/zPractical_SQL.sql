USE PolyLibDB
GO

CREATE TABLE Users (
	user_id INT IDENTITY(1,1) PRIMARY KEY,
	username VARCHAR(255) UNIQUE,
	passwordHash VARCHAR(255),
	role VARCHAR(20) CHECK (role IN ('member', 'librarian'))
);

CREATE TABLE Books (
	book_id INT IDENTITY(1,1) PRIMARY KEY,
	title VARCHAR(255),
	author VARCHAR(255),
	availability CHAR(1) CHECK (availability IN ('Y','N'))
);

INSERT INTO Books (title, author, availability) VALUES
('To Kill a Mockingbird', 'Harper Lee', 'Y'),
('1984', 'George Orwell', 'Y'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'N'),
('The Catcher in the Rye', 'J.D. Salinger', 'Y'),
('Moby-Dick', 'Herman Melville', 'N'),
('Pride and Prejudice', 'Jane Austen', 'Y'),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Y'),
('The Hobbit', 'J.R.R. Tolkien', 'N'),
('War and Peace', 'Leo Tolstoy', 'Y'),
('Ulysses', 'James Joyce', 'N')


DELETE FROM Users;

select * from Users;

select * from Books;

-- Drop table Users, Books;