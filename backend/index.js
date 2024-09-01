const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const user = require("./routes/user");
const subjectRoutes = require("./routes/subject");
const authorRoutes = require("./routes/author");
const bookRoutes = require("./routes/book");
const app = express();
var cors = require("cors");
const PORT = process.env.PORT || 4000;
app.use(
  cors({  
    origin: "*",
  })
);


app.use(express.json());
app.use("/api/v1", user);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/authors", authorRoutes);
app.use("/api/v1/books", bookRoutes);
app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});

dbConnect();

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});
