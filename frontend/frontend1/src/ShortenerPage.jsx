import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";

const ShortenerPage = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleShorten = async () => {
    const res = await axios.post("http://localhost:3000/shorturls", { url });
    setResult(res.data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4">URL Shortener</Typography>
      <TextField
        label="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />
      <Button onClick={handleShorten} variant="contained" sx={{ mt: 2 }}>
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
