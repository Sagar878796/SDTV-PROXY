const express = require("express");
const axios = require("axios");
const app = express();

// FETCH M3U
app.get("/fetch", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.send("No URL");

    try {
        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 15000
        });

        res.setHeader("Content-Type", "text/plain");
        res.send(response.data);

    } catch {
        res.status(500).send("Fetch Error");
    }
});

// STREAM PROXY
app.get("/play", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.send("No URL");

    try {
        const response = await axios({
            method: "GET",
            url: url,
            responseType: "stream",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Referer": url
            },
            timeout: 20000
        });

        res.setHeader("Content-Type", response.headers["content-type"]);
        res.setHeader("Access-Control-Allow-Origin", "*");

        response.data.pipe(res);

    } catch {
        res.status(500).send("Stream Error");
    }
});

// M3U8 REWRITE (important)
app.get("/m3u8", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.send("No URL");

    try {
        const response = await axios.get(url);
        let data = response.data;

        data = data.replace(/(https?:\/\/[^\s]+)/g, (match) => {
            return `/play?url=${encodeURIComponent(match)}`;
        });

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.send(data);

    } catch {
        res.status(500).send("M3U8 Error");
    }
});

app.get("/", (req, res) => {
    res.send("🔥 IPTV Proxy Running");
});

app.listen(3000, () => console.log("Server started"));
