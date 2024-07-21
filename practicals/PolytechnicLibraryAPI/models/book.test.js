// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql");

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    sql.connect.mockResolvedValue({
      request: jest.fn().mockReturnValue({
        query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
      }),
      close: jest.fn(),
    });

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(books).toHaveLength(2);
    
    books.forEach((book, index) => {
      expect(book).toBeInstanceOf(Book);
      expect(book.id).toBe(mockBooks[index].book_id);
      expect(book.title).toBe(mockBooks[index].title);
      expect(book.author).toBe(mockBooks[index].author);
      expect(book.availability).toBe(mockBooks[index].availability);
    });
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });

  it("should handle empty result set", async () => {
    sql.connect.mockResolvedValue({
      request: jest.fn().mockReturnValue({
        query: jest.fn().mockResolvedValue({ recordset: [] }),
      }),
      close: jest.fn(),
    });

    const books = await Book.getAllBooks();
    expect(books).toHaveLength(0);
  });
});

describe("Book.updateBookAvailability", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should update the availability of a book", async () => {
      const mockBook = {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      };
  
      const newAvailability = "N";
  
      sql.connect.mockResolvedValue({
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
        }),
        close: jest.fn(),
      });
  
      // Mock getBookById to return a new Book instance
      Book.getBookById = jest.fn().mockResolvedValue(
        new Book(mockBook.book_id, mockBook.title, mockBook.author, newAvailability)
      );
  
      const updatedBook = await Book.updateBookAvailability(mockBook.book_id, { availability: newAvailability });
  
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(updatedBook).toBeInstanceOf(Book);
      expect(updatedBook.id).toBe(mockBook.book_id);
      expect(updatedBook.title).toBe(mockBook.title);
      expect(updatedBook.author).toBe(mockBook.author);
      expect(updatedBook.availability).toBe(newAvailability);
  
      // Verify that getBookById was called with the correct id
      expect(Book.getBookById).toHaveBeenCalledWith(mockBook.book_id);
    });
  
    it("should return null if book with the given id does not exist", async () => {
      const nonExistentId = 999;
  
      sql.connect.mockResolvedValue({
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ rowsAffected: [0] }),
        }),
        close: jest.fn(),
      });
  
      // Mock getBookById to return null for a non-existent book
      Book.getBookById = jest.fn().mockResolvedValue(null);
  
      const result = await Book.updateBookAvailability(nonExistentId, { availability: "N" });
  
      expect(result).toBeNull();
      // Verify that getBookById was called with the correct id
      expect(Book.getBookById).toHaveBeenCalledWith(nonExistentId);
    });
  
    it("should throw an error if there's a database error", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
  
      await expect(Book.updateBookAvailability(1, { availability: "N" })).rejects.toThrow(errorMessage);
    });
});