import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";

const StatsPage = () => {
  const [allUrls, setAllUrls] = useState([]);
  const [shortcode, setShortcode] = useState("");
  const [searched, setSearched] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [fetchError, setFetchError] = useState("");

  const fetchAll = async () => {
    setLoadingAll(true);
    setFetchError("");
    try {
      const res = await axios.get(`http://localhost:3000/ALL`);
      console.log("Fetched all URLs:", res.data); // Debug output
      setAllUrls(res.data);
    } catch (err) {
      setFetchError("Failed to fetch all URLs");
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchStatsByShortcode = async () => {
    if (!shortcode.trim()) return;
    setLoadingSearch(true);
    setSearchError("");
    setSearched(null);
    try {
      const res = await axios.get(
        `http://localhost:3000/shorturls/${shortcode}`
      );
      setSearched({ shortcode, ...res.data });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setSearchError("Shortcode not found");
      } else {
        setSearchError("Error fetching stats");
      }
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Short URL Stats
      </Typography>

      {/* Search Section */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Enter Shortcode"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={fetchStatsByShortcode}
          disabled={loadingSearch}
        >
          {loadingSearch ? <CircularProgress size={20} /> : "Search Stats"}
        </Button>
        {searchError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {searchError}
          </Typography>
        )}
      </Box>

      {/* Result of specific shortcode */}
      {searched && (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">
            Short URL:{" "}
            <a
              href={`http://localhost:3000/shorturls/redirect/${searched.shortcode}`}
              target="_blank"
              rel="noreferrer"
            >
              http://localhost:3000/shorturls/redirect/{searched.shortcode}
            </a>
          </Typography>
          <Typography>Original URL: {searched.originalUrl}</Typography>
          <Typography>
            Created At: {new Date(searched.createdAt).toLocaleString()}
          </Typography>
          <Typography>
            Expiry: {new Date(searched.expiry).toLocaleString()}
          </Typography>
          <Typography>Total Clicks: {searched.clicks}</Typography>
          <Divider sx={{ my: 1 }} />
          {searched.clickDetails.length === 0 ? (
            <Typography>No clicks recorded yet.</Typography>
          ) : (
            searched.clickDetails.map((click, i) => (
              <Typography key={i}>
                • {new Date(click.timestamp).toLocaleString()} |{" "}
                {click.referrer} | {click.location}
              </Typography>
            ))
          )}
        </Paper>
      )}

      {/* Fetch All Section */}
      <Button
        variant="outlined"
        onClick={fetchAll}
        disabled={loadingAll}
        sx={{ mt: 2 }}
      >
        {loadingAll ? <CircularProgress size={20} /> : "Fetch All Created URLs"}
      </Button>
      {fetchError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {fetchError}
        </Typography>
      )}

      {allUrls.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          {allUrls.map((url, idx) => (
            <Paper key={idx} sx={{ padding: 2, mb: 2 }}>
              <Typography variant="h6">
                <a
                  href={`http://localhost:3000/shorturls/redirect/${url.shortcode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {`http://localhost:3000/shorturls/redirect/${url.shortcode}`}
                </a>
              </Typography>
              <Typography>Original URL: {url.originalUrl}</Typography>
              <Typography>
                Created At: {new Date(url.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                Expiry: {new Date(url.expiry).toLocaleString()}
              </Typography>
              <Typography>Total Clicks: {url.clicks.length}</Typography>
              <Divider sx={{ my: 1 }} />
              {url.clicks.length === 0 ? (
                <Typography>No clicks yet.</Typography>
              ) : (
                url.clicks.map((click, i) => (
                  <Typography key={i} sx={{ fontSize: "0.9rem", ml: 1 }}>
                    - {new Date(click.timestamp).toLocaleString()} |{" "}
                    {click.referrer} | {click.location}
                  </Typography>
                ))
              )}
            </Paper>
          ))}
        </Box>
      ) : (
        !loadingAll && (
          <Typography sx={{ mt: 2 }}>
            No URLs have been created yet. Click "Fetch All" to check again.
          </Typography>
        )
      )}
    </Box>
  );
};

export default StatsPage;
