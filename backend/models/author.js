const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("Author", AuthorSchema);
