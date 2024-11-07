import express from "express";
import axios from "axios";
import fs from "node:fs";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "apollo123",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books;");
    //console.log(result.rows);
    let books = result.rows;
    books.forEach((book) => {
      book.isbn = book.isbn.trim();
    });
    console.log(books);
    res.render("index.ejs", {
      books: books,
    });
    // code for getting cover:
    //  const response = await axios.get(
    //   "https://covers.openlibrary.org/b/isbn/0385472579-S.jpg",
    //   { responseType: "arraybuffer" }
    // );
    // console.log(response.data);
    // fs.writeFile("test.jpg", response.data, (err) => {
    //   if (err) throw err;
    //   console.log("The file has been saved.");
    // });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }
});

app.get("/create", (req, res) => {
  //res.render("./edit.ejs", { blog: new Blog("", ""), indexOfBlog: -1 });
  res.render("./submit.ejs");
});

app.post("/submit", (req, res) => {
  // TODO ZDE ZAČÍTTTTTTTTTTTTTTTTTTTTTTTTT data validation from form
  //req.body.title = req.body.title.trim();
  console.log(req.body);
});

// app.post("/edit", (req, res) => {
//   const index = req.body["indexOfBlog"];
//   res.render("./edit.ejs", { blog: blogsArray[index], indexOfBlog: index });
// });

app.listen(port, () => {
  console.log(`Hi, I am Server. I am running on port ${port}.`);
});
