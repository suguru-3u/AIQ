const express = require("express");
const influencerRouter = require("./src/presentation/influencerRouter-router.js");

const app = express();
// const port = process.env.LOCAL_API_PORT;
const port = 3000;

// JSONデータを扱う為に必要な設定
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", influencerRouter);

app.get("*", (req, res) => {
  res.status(404).send("存在しないURLです");
});
app.post("*", (req, res) => {
  res.status(404).send("存在しないURLです");
});
app.put("*", (req, res) => {
  res.status(404).send("存在しないURLです");
});
app.delete("*", (req, res) => {
  res.status(404).send("存在しないURLです");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
