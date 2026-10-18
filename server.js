const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));


app.post('/api/signup', (req, res) => {
  const userData = req.body;
  let existingData = [];
  const filePath = path.join(__dirname, 'user_data.json');

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
      existingData = JSON.parse(fileContent);
      if (!Array.isArray(existingData)) {
        existingData = [existingData]; // Convert to array if it was a single object
      }
    } catch (err) {
      existingData = [];
    }
  }

  existingData.push(userData);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  res.status(200).json({ message: 'data saved' });
});

//  tracks endpoints 

const tracksFilePath = path.join(__dirname, 'tracks.json');

// helper function to read tracks from tracks.json
const getTracks = () => {
  if (!fs.existsSync(tracksFilePath)) return [];
  try {
    const fileContent = fs.readFileSync(tracksFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};


// get all tracks
app.get('/api/tracks', (req, res) => {
  const tracks = getTracks();
  res.status(200).json(tracks);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});