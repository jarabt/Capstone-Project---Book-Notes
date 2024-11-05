import express from "express";
import axios from "axios";
import fs from "node:fs";
import pg from "pg";

const app = express();
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
    console.log(result.rows);

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

  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Hi, I am Server. I am running on port ${port}.`);
});
