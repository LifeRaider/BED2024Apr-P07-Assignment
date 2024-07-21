// booksController.test.js

const booksController = require("../controllers/booksController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/Book"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

describe("booksController.updateBookAvailability", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should update a book's availability and return the updated book", async () => {
      const mockBookId = 1;
      const mockNewBookAvailability = { available: false };
      const mockUpdatedBook = { id: mockBookId, title: "The Lord of the Rings", available: false };
  
      // Mock the Book.updateBookAvailability function to return the updated book
      Book.updateBookAvailability.mockResolvedValue(mockUpdatedBook);
  
      const req = {
        params: { id: mockBookId.toString() },
        body: mockNewBookAvailability,
      };
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await booksController.updateBookAvailability(req, res);
  
      expect(Book.updateBookAvailability).toHaveBeenCalledWith(mockBookId, mockNewBookAvailability); // Check if updateBookAvailability was called correctly
      expect(res.json).toHaveBeenCalledWith(mockUpdatedBook); // Check the response body
    });
  
    it("should return a 404 status if the book is not found", async () => {
      const mockBookId = 1;
      const mockNewBookAvailability = { available: true };
  
      // Mock the Book.updateBookAvailability function to return null (book not found)
      Book.updateBookAvailability.mockResolvedValue(null);
  
      const req = {
        params: { id: mockBookId.toString() },
        body: mockNewBookAvailability,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await booksController.updateBookAvailability(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Book not found");
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const mockBookId = 1;
      const mockNewBookAvailability = { available: true };
      const errorMessage = "Database error";
  
      // Simulate an error
      Book.updateBookAvailability.mockRejectedValue(new Error(errorMessage));
  
      const req = {
        params: { id: mockBookId.toString() },
        body: mockNewBookAvailability,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await booksController.updateBookAvailability(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error updating book availability");
    });
});