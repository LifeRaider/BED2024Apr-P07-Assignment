const Book = require("../models/book");

const getAllBooks = async (req, res) => {
    try {
      const books = await Book.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving books");
    }
};

const getBookById = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
      const book = await Book.getBookById(bookId);
      if (!book) {
        return res.status(404).send("Book not found");
      }
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving book");
    }
};

const updateBookAvailability = async (req, res) => {
    const bookId = parseInt(req.params.id);
    const newBookAvailability = req.body.availability;

    try {
        const updatedBook = await Book.updateBookAvailability(bookId, newBookAvailability);
        if (!updatedBook) {
            return res.status(404).send("Book not found");
        }
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating book availability");
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    updateBookAvailability
};