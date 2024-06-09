const express = require("express");
const influencerRouter = require("./src/presentation/influencerRouter-router.js");

const app = express();
const port = process.env.LOCAL_API_PORT;

app.use(express.json());

app.use("/api/v1", influencerRouter);

const errorInfo = {
  developerMessage: "存在しないURLです",
  userMessage: "存在しないURLです",
};

app.get("*", (_req, res) => {
  res.status(404).json({ errors: errorInfo });
});
app.post("*", (_req, res) => {
  res.status(404).json({ errors: errorInfo });
});
app.put("*", (_req, res) => {
  res.status(404).json({ errors: errorInfo });
});
app.delete("*", (_req, res) => {
  res.status(404).json({ errors: errorInfo });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
