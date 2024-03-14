const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

const mongoDBUri = process.env.REACT_APP_MONGODB_URI;

mongoose.connect(mongoDBUri, {useNewUrlParser: true, useUnifiedTopology: true,});
const mongoDatabase = mongoose.connection;

mongoDatabase.once('open', () => {
  console.log('Connected to MongoDB');
});

const playlistSchema = new mongoose.Schema({
    videoId: String,
    title: String,
    description: String,
    thumbnail: String,
    genre: String,
    director: String,
    writer: String,
    cast: String,
    release: String,
    rating: String,
    imdb: String,
});

const Playlist = mongoose.model('Playlist', playlistSchema);


router.get('/playlist/:genre', async (req, res) => {
    try {
        
        const { genre } = req.params;        
        console.log(genre);
        const playlistData = await Playlist.find({ genre: { $regex: new RegExp(genre, 'i') } });
        console.log(playlistData);
        res.json(playlistData);
    } catch (error) {
        console.error('Error fetching playlist data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/updatePlaylistData', async (req, res) => {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const channelId = 'UCX1nchEcBshItKBeJvH-YMw';
    //FREEMOVIES: UCX1nchEcBshItKBeJvH-YMw
    //WUTANG: UCUpbgPbDccjoB9PxI-nI7oA
    //MOVIECENTRAL: UCGBzBkV-MinlBvHBzZawfLQ
    //YOUTUBEMOVIES: UCuVPpxrm2VAgpH3Ktln4HXg
    const maxFetchCount = 1;
    let fetchedStreams = [];
    let token = null;
    try {
        for(let x = 0; x < maxFetchCount; x++) {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50${token ? `&pageToken=${token}` : ''}`
            );

            const data = await response.json();
            fetchedStreams = fetchedStreams.concat(data.items);
            if (data.nextPageToken) {
                token = data.nextPageToken;
            }
            else{
                break;
            }
        }
        
        const filteredStreams = fetchedStreams.filter((video) => {
            const { title, description } = video.snippet;
            return ( title.toLowerCase().includes('movie') || description.toLowerCase().includes('movie') );
        });
        
        await Playlist.deleteMany(); // Clear existing data
        const playlistItems = filteredStreams.map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: {
                low: {
                    url: item.snippet.thumbnails.default.url,
                },
                medium: {
                    url: item.snippet.thumbnails.default.url,
                },
                high: {
                    url: item.snippet.thumbnails.default.url,
                },
            },
            genre: 'Documentary, Drama, Comedy, Action, Adventure, Mystery, Thriller, Romance, Fantasy, Sci-Fi',
            director: 'Leeroy Ashcraft',
            writer: 'Jake Hill',
            cast: 'Alan Whitley, Sara Downs, Ben Hatfield',
            release: '2022',
            rating: 'PG-13',
            imdb: '6.6',
        }));
        
        
        await Playlist.insertMany(playlistItems);

        res.json({ success: true, filteredStreams: fetchedStreams });

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


const getFormattedDate = () => {
    var currentTime = new Date();
    var month = String(currentTime.getMonth() + 1).padStart(2, '0');
    var day = String(currentTime.getDate()).padStart(2, '0');
    var year = currentTime.getFullYear();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes;
}

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: getFormattedDate() }
});

const Chat = mongoose.model('Chat', chatSchema);


router.get('/chat/message/:room', async (req, res) => {
    try {
        const { room } = req.params; 
        console.log(room);
        
        const chatData = await Chat.find({ roomId: { $regex: new RegExp(room, 'i') } });
        console.log(chatData);
        res.json({ success: true, chatData: chatData, room: room });
    } catch (error) {
        console.error('Error fetching chat data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/chat/message/', async (req, res) => {
    try {
        const { userId, roomId, message } = req.body;
        const newMessage = new Chat({ userId, roomId, message });
        const storedMessage = await newMessage.save();
        res.json({ success: true, storedMessage: storedMessage });
    } catch (error) {
        console.error('Error inserting chat data into MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/getAvailabiityStatus', function(req, res, next) {
    res.send('Robert Wooden Is Available');
});

router.get('/getConnectionTime', function(req, res, next) {
    const currentTime = new Date().toLocaleTimeString();
    res.send('Connected at: ' + currentTime);
});

module.exports = router;