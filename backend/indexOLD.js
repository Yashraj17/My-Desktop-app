const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/categories", async (req, res) => {
  const data = await db("item_categories").select();
  res.json(data);
});

app.post("/api/categories", async (req, res) => {
  const { category_name } = req.body;
  await db("item_categories").insert({ category_name });
  res.json({ success: true });
});

app.delete("/api/categories/:id", async (req, res) => {
  await db("item_categories").where({ id: req.params.id }).del();
  res.json({ success: true });
});

module.exports = app;
