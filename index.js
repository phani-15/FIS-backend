import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Faculty Profile PDF Generator!");
});

const port=process.env.port || 3000

app.listen(port, () => console.log(`Server running on port ${port}`));