// server.js
import express from "express";
import { Log } from "../LoggingMiddleware/logger.js";
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrlRoutes = require('./routes/shorturl.routes');

app.use(cors());
app.use(express.json());
app.use(logger);

mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/shorturls', shortUrlRoutes);
const app = express();
app.use(express.json());

app.get("/test", async (req, res) => {
  try {
    await Log("backend", "info", "route", "Test route hit successfully");
    res.status(200).send("Backend route working!");
  } catch (err) {
    await Log("backend", "error", "route", "Failed to hit backend test route");
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
