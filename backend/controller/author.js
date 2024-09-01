const Author = require("../models/author");
const Book = require("../models/books"); // Include the Book model

// Get all authors with populated subject and books
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate("subject").populate("books");
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new author
exports.createAuthor = async (req, res) => {
  const author = new Author({
    name: req.body.name,
    subject: req.body.subjectId,
    books: req.body.bookIds || [], // Ensure books array is set to empty if not provided
  });

  try {
    const newAuthor = await author.save();

    // Update the books to include the new author
    if (req.body.bookIds && req.body.bookIds.length > 0) {
      await Book.updateMany(
        { _id: { $in: req.body.bookIds } },
        { $addToSet: { authors: newAuthor._id } }
      );
    }

    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single author by ID with populated subject and books
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
      .populate("subject")
      .populate("books");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing author
exports.updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        subject: req.body.subjectId,
        books: req.body.bookIds || [], // Ensure books array is updated correctly
      },
      { new: true }
    )
      .populate("subject")
      .populate("books");

    // Update the books to reflect changes
    if (req.body.bookIds && req.body.bookIds.length > 0) {
      await Book.updateMany(
        { _id: { $in: req.body.bookIds } },
        { $addToSet: { authors: updatedAuthor._id } }
      );
    }

    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Remove the author reference from books
    await Book.updateMany(
      { authors: author._id },
      { $pull: { authors: author._id } }
    );

    await Author.findByIdAndDelete(req.params.id);
    res.json({ message: "Author deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
