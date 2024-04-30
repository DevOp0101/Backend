const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()
const Post = require('../controllers/post.controller');
const Search = require('../controllers/search.controller');
const Recommend = require('../controllers/recommend.controller');
const Chat = require('../controllers/chat.controller');
const TextToSpeech = require('../controllers/texttospeech.controller');

const mongoDBUri = process.env.REACT_APP_MONGODB_URI;

mongoose.connect(mongoDBUri, {useNewUrlParser: true, useUnifiedTopology: true,});
const mongoDatabase = mongoose.connection;

mongoDatabase.once('open', () => {
    console.log('Connected to MongoDB');
});

// Route search into controllers
router.get('/search/enquiry/:enquiry', Search.searchByEnquiry);
router.get('/search/video/:videoId', Search.searchByVideoId);
router.get('/search/genre/:genre', Search.searchByGenre);

// Route post into controllers
router.post('/post', Post.updateAllVideoData);

// Route recommend into controllers
router.post('/recommend/set/', Recommend.recommendationSet);
router.get('/recommend/overall/:userId', Recommend.recommendationGetOverall);
router.get('/recommend/recent/:userId', Recommend.recommendationGetRecent);

// Route chat into controllers
router.get('/chat/message/:room', Chat.getChatMessage);
router.get('/chat/message/', Chat.sendChatMessage);

// Route text to speech into controllers
router.post('/tts/stream/', TextToSpeech.convertToAudio);


module.exports = router;