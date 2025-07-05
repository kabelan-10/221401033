import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";

const ShortenerPage = () => {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [customShortcode, setCustomShortcode] = useState("");

  const isValidUrl = (input) => {
    return input.startsWith("http://") || input.startsWith("https://");
  };

  const handleShorten = async () => {
    setError("");
    if (!isValidUrl(url)) {
      setError("URL must start with http:// or https://");
      return;
    }

    try {
      const payload = { url };
      if (validity) payload.validity = parseInt(validity);
      if (customShortcode) payload.shortcode = customShortcode;

      const res = await axios.post("http://localhost:3000/shorturls", payload);
      setResult(res.data);
    } catch (err) {
      setError("Failed to shorten URL");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4">URL Shortener</Typography>
      <TextField
        label="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        error={!!error}
        helperText={error}
      />
      <TextField
        label="Expiry (in mins, optional)"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Custom Shortcode (optional)"
        value={customShortcode}
        onChange={(e) => setCustomShortcode(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button onClick={handleShorten} variant="contained">
        Shorten
      </Button>
      {result && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Short URL: <a href={result.shortLink}>{result.shortLink}</a>
          <br />
          Expires at: {result.expiry}
        </Typography>
      )}
    </div>
  );
};

export default ShortenerPage;
