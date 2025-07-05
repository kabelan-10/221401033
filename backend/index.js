
const express = require('express');
const cors = require('cors');
const shortUrlRoutes = require('./routes/shorturl.routes');
const { Log } = require('../LoggingMiddleware/logger'); 
const { readDB, writeDB } = require('../backend/utils/db');
const logger = require('../LoggingMiddleware/logger');

const app = express();
app.use(cors());
app.use(express.json());
// app.use(logger);
// app.get("/all", (req, res) => {
//    const pkg = 'ShortURLController::getAllUrls';

//   try {
//     const db = readDB();
//     console.log('📊 getAllUrls returning:', db.urls); // Debug output
//     res.json(db.urls);
//   } catch (err) {
//     Log(err.stack, 'ERROR', pkg, err.message);
//     res.status(500).json({ error: 'Failed to fetch all URLs' });
//   }
// });
app.get("/test", async (req, res) => {
  try {
    await Log("backend", "info", "route", "Test route hit successfully");
    res.status(200).send("Backend route working!");
  } catch (err) {
    await Log("backend", "error", "route", "Failed to hit backend test route");
    res.status(500).send("Something went wrong");
  }
});

app.use('/shorturls', shortUrlRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));