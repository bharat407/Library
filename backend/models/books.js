const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  image: {
    public_id: String,
    url: String,
  },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
});

module.exports = mongoose.model("Book", BookSchema);
