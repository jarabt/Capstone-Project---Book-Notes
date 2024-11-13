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
    let books = result.rows;
    res.render("index.ejs", {
      books: books,
    });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }
});

app.get("/create", (req, res) => {
  //res.render("./edit.ejs", { blog: new Blog("", ""), indexOfBlog: -1 });
  res.render("./create.ejs");
});

app.post("/detail", async (req, res) => {
  try {
    //console.log(req.body.isbnOfBook);
    const result = await db.query("SELECT * FROM books WHERE isbn = $1", [
      req.body.isbnOfBook,
    ]);
    //console.log(result.rows[0]);
    res.render("./detail.ejs", { item: result.rows[0] });
  } catch (error) {
    console.log(error);
  }
});

app.post("/submit", async (req, res) => {
  try {
    const isbn = req.body["isbn"].trim();
    const title = req.body["title"].trim();
    const author = req.body["author"].trim();
    const date = req.body["date_read"].trim();
    const rating = req.body["rating"].trim();
    const about = req.body["about"].trim();
    const notes = req.body["notes"].trim();

    console.log(req.body);

    //const isbn = "0345816021";
    const url = "https://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg";
    const jpgNamePath = "./public/book_images/" + isbn + ".jpg";
    const response = await axios.get(url, { responseType: "arraybuffer" });
    console.log(response.data);
    fs.writeFile(jpgNamePath, response.data, (err) => {
      if (err) throw err;
      console.log("The file has been saved.");
    });
    await db.query("INSERT INTO books VALUES ($1, $2, $3, $4, $5, $6, $7);", [
      isbn,
      title,
      author,
      date,
      rating,
      about,
      notes,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

  //console.log(isbn.length);
});

// app.post("/edit", (req, res) => {
//   const index = req.body["indexOfBlog"];
//   res.render("./edit.ejs", { blog: blogsArray[index], indexOfBlog: index });
// });

app.listen(port, () => {
  console.log(`Hi, I am Server. I am running on port ${port}.`);
});
