import express from "express";
import axios from "axios";
import fs from "node:fs";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

env.config();

//using Environment Variables
const port = process.env.APP_PORT;
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT5432,
});

db.connect();

//home route
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

//order by title route
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

//order by date route
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

//order by rating route
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
    //console.log(req.body);

    if (!req.body.isEdit) {
      //if user creates a new record
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
      //user is just editing existing record
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

//user submitted edit-changes
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

//user clicked on delete button
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
