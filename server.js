const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // index.html, script.js, style.css აქვე იქნება

// YouTube ვიდეო ჩამოტვირთვა
app.get("/download", async (req, res) => {
  const { url, format } = req.query;

  if (!url || !format) {
    return res.status(400).send("Missing url or format");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    res.header("Content-Disposition", `attachment; filename="${title}.${format}"`);

    if (format === "mp4") {
      ytdl(url, { quality: "highestvideo" }).pipe(res);
    } else if (format === "mp3") {
      ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } else {
      res.status(400).send("Unsupported format");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading video");
  }
});

// TikTok ვიდეოების გადმოწერა (სრული URL პირდაპირ გადმოაქვს)
app.get("/download-tiktok", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url");

  try {
    const fileName = "tiktok_video.mp4";
    const filePath = path.resolve(__dirname, fileName);
    const writer = fs.createWriteStream(filePath);

    const axios = require("axios");
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    writer.on("finish", () => {
      res.download(filePath, fileName, (err) => {
        if (err) console.error(err);
        fs.unlinkSync(filePath); // ჩამოტვირთვის შემდეგ წაშლა
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading TikTok video");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
