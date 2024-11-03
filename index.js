import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Hi, I am Server. I am running on port ${port}.`);
});
