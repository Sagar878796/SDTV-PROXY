const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => {
  res.send("IPTV Proxy Running 🚀");
});

// 🔥 STREAM PROXY
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


// 🔥 AUTO PLAYLIST GENERATOR (YAHI ADD KARNA THA)
app.get("/playlist", async (req, res) => {
  try {
    const source = "https://latest.rkdyiptv.workers.dev/tg/rkdyiptv.m3u";

    const response = await axios.get(source);
    let data = response.data;

    const modified = data.replace(
  /(https?:\/\/[^\s]+)/g,
  (match) =>
    `https://sdtv-proxy.onrender.com/play?url=${encodeURIComponent(match)}`
);

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(modified);

  } catch (err) {
    res.send("Error: " + err.message);
  }
});


// 🔻 LAST LINE (IMPORTANT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
