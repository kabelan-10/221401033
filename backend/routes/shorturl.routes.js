const express = require('express');
const router = express.Router();
const controller = require('../controllers/shorturl.controller');

// Route to create a short URL
router.post('/', controller.createShortUrl);

// Route to get all short URLs
// router.get('/', controller.getAllUrls);

// Route to get statistics for a given shortcode
router.get('/:shortcode', controller.getStats);

// Route to handle redirection
router.get('/redirect/:shortcode', controller.redirect);

module.exports = router;