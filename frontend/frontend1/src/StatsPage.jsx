import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";

const StatsPage = () => {
  const [shortcode, setShortcode] = useState("");
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const res = await axios.get(`http://localhost:3000/shorturls/${shortcode}`);
    setStats(res.data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4">Short URL Stats</Typography>
      <TextField
        label="Shortcode"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        fullWidth
      />
      <Button onClick={fetchStats} variant="contained" sx={{ mt: 2 }}>
        Fetch Stats
      </Button>
      {stats && (
        <div style={{ marginTop: "1rem" }}>
          <Typography>Original URL: {stats.originalUrl}</Typography>
          <Typography>Created At: {stats.createdAt}</Typography>
          <Typography>Expiry: {stats.expiry}</Typography>
          <Typography>Total Clicks: {stats.clicks}</Typography>
          <Typography>Click Details:</Typography>
          {stats.clickDetails.map((click, index) => (
            <Typography key={index}>
              - {click.timestamp} | {click.referrer} | {click.location}
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsPage;
