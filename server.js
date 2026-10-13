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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});