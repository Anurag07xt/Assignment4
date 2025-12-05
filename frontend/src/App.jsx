import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);

  // ---------------- SEARCH IMAGE ----------------
  const handleSearch = async () => {
    if (!query.trim()) return alert("Enter something to search");

    try {
      const res = await fetch(`http://localhost:3000/api/getImage?name=${query}`);
      const data = await res.json();

      if (data.url) {
        setImageUrl("http://localhost:3000" + data.url + "?t=" + Date.now());
      } else {
        alert("No image found");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching image");
    }
  };

  // ---------------- UPLOAD IMAGE ----------------
  const handleUpload = async () => {
    if (!file || !query.trim()) {
      return alert("Choose a file and enter a name first");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `http://localhost:3000/api/upload?name=${query}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.url) {
        setImageUrl("http://localhost:3000" + data.url + "?t=" + Date.now());
        alert("Upload successful!");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container">
      <h1>Image Search + Upload</h1>

      {/* SEARCH */}
      <div className="row">
        <input
          type="text"
          placeholder="Type something like 'tom'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* UPLOAD */}
      <div className="row">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* DISPLAY IMAGE */}
      {imageUrl && (
        <div className="imageBox">
          <img src={imageUrl} alt="result" />
        </div>
      )}
    </div>
  );
}

export default App;
