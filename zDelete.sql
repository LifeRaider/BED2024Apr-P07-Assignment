USE BrainJamSystem
Go

-- Drop foreign key constraints first to avoid conflicts
ALTER TABLE Users DROP CONSTRAINT FK_Users_ParentId;
GO

-- Drop all Class tables first
DROP TABLE IF EXISTS Class01;
DROP TABLE IF EXISTS Class02;
DROP TABLE IF EXISTS Class03;
DROP TABLE IF EXISTS Class04;
GO

-- Drop the Classes and Users tables
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS Users;
GO