const Book = require("../models/books"); // Remove the duplicate import
const cloudinary = require("../config/cloudinary"); // Ensure Cloudinary is configured correctly

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("subject").populate("authors");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book with optional image upload
exports.createBook = async (req, res) => {
  try {
    let imageResult;
    if (req.file) {
      const base64Image = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
      imageResult = await cloudinary.uploader.upload(dataURI, {
        folder: "book_covers",
      });
    }

    const book = new Book({
      title: req.body.title,
      subject: req.body.subjectId,
      image: imageResult
        ? {
            public_id: imageResult.public_id,
            url: imageResult.secure_url,
          }
        : undefined,
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get books by subject ID
exports.getBooksBySubject = async (req, res) => {
  try {
    const subjectId = req.query.subjectId;
    const books = await Book.find({ subject: subjectId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single book by ID with populated subject
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("subject");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing book with optional image update
exports.updateBook = async (req, res) => {
  try {
    let imageResult;
    if (req.file) {
      const base64Image = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
      imageResult = await cloudinary.uploader.upload(dataURI, {
        folder: "book_covers",
      });

      const oldBook = await Book.findById(req.params.id);
      if (oldBook.image && oldBook.image.public_id) {
        await cloudinary.uploader.destroy(oldBook.image.public_id);
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        subject: req.body.subjectId,
        image: imageResult
          ? {
              public_id: imageResult.public_id,
              url: imageResult.secure_url,
            }
          : undefined,
      },
      { new: true }
    ).populate("subject");

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a book with image removal
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.image && book.image.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
