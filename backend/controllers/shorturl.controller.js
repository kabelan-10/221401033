const { v4: uuidv4 } = require('uuid');
const geoip = require('geoip-lite');
const Log = require('../../LoggingMiddleware/logger'); // Adjust the path as necessary
const { readDB, writeDB } = require('../utils/db');

exports.createShortUrl = async (req, res) => {
  const { url, validity, shortcode } = req.body;
  const pkg = 'ShortURLController::create';

  try {
    const code = shortcode?.trim() || uuidv4().slice(0, 6);
    const validMins = validity && !isNaN(validity) ? parseInt(validity) : 30;
    const expiry = new Date(Date.now() + validMins * 60 * 1000);

    const db = readDB();
    if (db.urls.find(u => u.shortcode === code)) {
      return res.status(400).json({ error: 'Shortcode already exists' });
    }

    db.urls.push({
      originalUrl: url,
      shortcode: code,
      createdAt: new Date().toISOString(),
      expiry: expiry.toISOString(),
      clicks: [],
    });
    writeDB(db);

    Log('', 'INFO', pkg, `Created short URL for ${url}`);
    res.status(201).json({ shortLink: `http://localhost:3000/shorturls/redirect/${code}`, expiry });
  } catch (err) {
    Log(err.stack, 'ERROR', pkg, err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUrls = async (req, res) => {
  const pkg = 'ShortURLController::getAllUrls';

  try {
    const db = readDB();
    console.log('📊 getAllUrls returning:', db.urls); // Debug output
    res.json(db.urls);
  } catch (err) {
    Log(err.stack, 'ERROR', pkg, err.message);
    res.status(500).json({ error: 'Failed to fetch all URLs' });
  }
};

exports.getStats = async (req, res) => {
  const pkg = 'ShortURLController::getStats';

  try {
    const db = readDB();
    if( req.params.shortcode === 'ALL') {
      return res.json(db.urls);
    }
    const shortUrl = db.urls.find(u => u.shortcode === req.params.shortcode);
    if (!shortUrl) return res.status(404).json({ error: 'Shortcode not found' });

    res.json({
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      expiry: shortUrl.expiry,
      clicks: shortUrl.clicks.length,
      clickDetails: shortUrl.clicks,
    });
  } catch (err) {
    Log(err.stack, 'ERROR', pkg, err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

exports.redirect = async (req, res) => {
  const pkg = 'ShortURLController::redirect';

  try {
    const db = readDB();
    const shortUrl = db.urls.find(u => u.shortcode === req.params.shortcode);
    if (!shortUrl) return res.status(404).send('Not found');

    const now = new Date();
    if (new Date(shortUrl.expiry) < now) return res.status(410).send('Link expired');

    shortUrl.clicks.push({
      timestamp: now.toISOString(),
      referrer: req.headers.referer || 'Direct',
      location: geoip.lookup(req.ip)?.country || 'Unknown',
    });

    writeDB(db);
    res.redirect(shortUrl.originalUrl);
  } catch (err) {
    Log(err.stack, 'ERROR', pkg, err.message);
    res.status(500).send('Redirection failed');
  }
};
