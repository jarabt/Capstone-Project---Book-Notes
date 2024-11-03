import express from "express";
import axios from "axios";
import fs from "node:fs";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://covers.openlibrary.org/b/isbn/0385472579-S.jpg",
      { responseType: "arraybuffer" }
    );
    console.log(response.data);
    fs.writeFile("test.jpg", response.data, (err) => {
      if (err) throw err;
      console.log("The file has been saved.");
    });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
  }

  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Hi, I am Server. I am running on port ${port}.`);
});
