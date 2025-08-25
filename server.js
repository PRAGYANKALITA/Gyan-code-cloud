// backend/server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const FILE_PATH = "./snippets.json";

app.use(cors());
app.use(bodyParser.json());

// Load all snippets
app.get("/snippets", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// Get single snippet by ID
app.get("/snippets/:id", (req, res) => {
  const id = Number(req.params.id);
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(404).send("Not found");
    const snippets = JSON.parse(data);
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return res.status(404).send("Not found");
    res.json(snippet);
  });
});

// Save new snippet
app.post("/snippets", (req, res) => {
  const { title, code, language } = req.body;

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    let snippets = [];
    if (!err && data) snippets = JSON.parse(data);

    const newSnippet = { id: Date.now(), title, code, language };
    snippets.push(newSnippet);

    fs.writeFile(FILE_PATH, JSON.stringify(snippets, null, 2), (err) => {
      if (err) return res.status(500).send("Error saving snippet");
      res.json(newSnippet);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
