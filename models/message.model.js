const mongoose = require("mongoose");

const getFormattedDate = () => {
    var currentTime = new Date();
    var month = String(currentTime.getMonth() + 1).padStart(2, '0');
    var day = String(currentTime.getDate()).padStart(2, '0');
    var year = currentTime.getFullYear();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes;
}

const messageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: getFormattedDate() }
});

let Message;

try {
    Message = mongoose.model("ChatMessage");
} catch (e) {
    Message = mongoose.model("ChatMessage", messageSchema);
}

module.exports = Message;