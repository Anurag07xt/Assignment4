// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // enable CORS

const app = express();

// Enable CORS for frontend
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Serve images from /public
app.use(express.static("public"));

// ---------------- MULTER CONFIG ----------------
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public"),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    // only allow jpg/jpeg files
    if (file.mimetype === "image/jpeg") cb(null, true);
    else cb(new Error("Only .jpg images allowed"));
  },
});

// ---------------- GET IMAGE ----------------
app.get("/api/getImage", (req, res) => {
  const name = (req.query.name || "").toLowerCase();
  let image = "default.jpg";

  if (name.includes("tom")) image = "tom.jpg";
  if (name.includes("jerry")) image = "jerry.jpg";
  if (name.includes("dog")) image = "dog.jpg";

  // Check if file exists
  const imagePath = path.join(__dirname, "public", image);
  if (!fs.existsSync(imagePath)) {
    image = "default.jpg";
  }

  res.json({ url: "/" + image });
});

// ---------------- UPLOAD IMAGE ----------------
app.post("/api/upload", upload.single("image"), (req, res) => {
  const character = (req.query.name || "").toLowerCase();
  if (!character) return res.status(400).json({ error: "Missing ?name= query" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  let finalName = "default.jpg";
  if (character.includes("tom")) finalName = "tom.jpg";
  else if (character.includes("jerry")) finalName = "jerry.jpg";
  else if (character.includes("dog")) finalName = "dog.jpg";

  const tempPath = path.join("public", req.file.originalname);
  const finalPath = path.join("public", finalName);

  // Delete old image if exists
  if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);

  // Rename uploaded file to final name
  fs.rename(tempPath, finalPath, (err) => {
    if (err) return res.status(500).json({ error: "Failed to rename file" });

    res.json({
      message: "Upload successful",
      url: "/" + finalName, // use this in frontend
    });
  });
});

// ---------------- START SERVER ----------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
