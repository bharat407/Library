const express = require("express");
const router = express.Router();
const authorController = require("../controller/author");

router.get("/", authorController.getAllAuthors);
router.post("/", authorController.createAuthor);
router.get("/:id", authorController.getAuthor);
router.put("/:id", authorController.updateAuthor);
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;
