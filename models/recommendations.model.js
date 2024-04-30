const mongoose = require("mongoose");

const recommendationsSchema = new mongoose.Schema({
    userId: String,
    recent: {
        genre: [String],
        director: [String],
    },
    overall: {
        genre: [String],
        director: [String],
    }
});

let Recommendations;

try {
    Recommendations = mongoose.model("Recommendations");
} catch (e) {
    Recommendations = mongoose.model("Recommendations", recommendationsSchema);
}

module.exports = Recommendations;