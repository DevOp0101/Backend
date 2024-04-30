const Message = require("../models/message.model");

const getChatMessage = async (req, res) => {
    try {
        const { room } = req.params; 
        console.log(room);

        const chatData = await Message.find({ roomId: { $regex: new RegExp(room, 'i') } });
        console.log(chatData);
        res.json({ success: true, chatData: chatData, room: room });
    } catch (error) {
        console.error('Error fetching chat data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
}

const sendChatMessage = async (req, res) => {
    try {
        const { userId, roomId, message } = req.body;
        const newMessage = new Message({ userId, roomId, message });
        const storedMessage = await newMessage.save();
        res.json({ success: true, storedMessage: storedMessage });
    } catch (error) {
        console.error('Error inserting chat data into MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getChatMessage, sendChatMessage }