const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    videoId: String,
    title: String,
    description: String,
    thumbnail: {
        low: { url: String },
        medium: { url: String },
        high: { url: String }
    },
    genre: String,
    director: String,
    writer: String,
    cast: String,
    release: String,
    rating: String,
    imdb: String
});

let Video;

try {
    Video = mongoose.model("Video");
} catch (e) {
    Video = mongoose.model("Video", videoSchema);
}

module.exports = Video;