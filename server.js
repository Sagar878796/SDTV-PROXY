const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => {
  res.send("IPTV Proxy Running 🚀");
});

// 🔥 PROXY STREAM
app.get("/play", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.send("No URL");

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        "User-Agent": "OTT Navigator IPTV",
        "Referer": "https://latest.rkdyiptv.workers.dev"
      }
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);

  } catch (err) {
    res.send("Error: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
