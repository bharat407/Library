const express = require("express");
const router = express.Router();
const bookController = require("../controller/book");
const upload = require("../middleware/img");

router.get("/", bookController.getAllBooks);
router.get("/books", bookController.getBooksBySubject);
router.post("/", upload.single("image"), bookController.createBook);
router.get("/:id", bookController.getBook);
router.put("/:id", upload.single("image"), bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
