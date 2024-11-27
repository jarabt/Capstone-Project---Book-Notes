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

//order by title
app.get("/by-title", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY title ASC;");
    let books = result.rows;
    res.render("index.ejs", {
      books: books,
    });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }
});

//order by date
app.get("/by-date", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM books ORDER BY date_read DESC;"
    );
    let books = result.rows;
    res.render("index.ejs", {
      books: books,
    });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }
});

//order by rating
app.get("/by-rating", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC;");
    let books = result.rows;
    res.render("index.ejs", {
      books: books,
    });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }
});

app.get("/create", (req, res) => {
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

    //if new record
    if (!req.body.isEdit) {
      //trial const isbn = "0345816021";
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
    } else {
      //just editing the existing record
      //console.log(isbn.length);
      await db.query(
        "UPDATE books SET title=$1, author=$2, date_read=$3, rating=$4, about=$5, notes=$6 WHERE isbn=$7;",
        [title, author, date, rating, about, notes, isbn]
      );
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try {
    //console.log(req.body.isbnOfBook);
    const result = await db.query("SELECT * FROM books WHERE isbn = $1", [
      req.body.isbnOfBook,
    ]);
    //console.log(result.rows[0]);
    res.render("./create.ejs", { item: result.rows[0] });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  try {
    //console.log(req.body.isbnOfBook);
    await db.query("DELETE FROM books WHERE isbn = $1", [req.body.isbnOfBook]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Hi, I am Server. I am running on port ${port}.`);
});
