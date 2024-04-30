const Video = require("../models/video.model");
const calculateDistance = require('../utils/distance.js');

const searchByEnquiry = async (req, res) => {
    try {
        const { enquiry } = req.params;        
        console.log(enquiry);
        const searchData = await Video.find({ title: { $regex: new RegExp(enquiry, 'i') } });
        const filteredSearchData = searchData.filter(searchItem => {
            const distance = calculateDistance(enquiry.toLowerCase(), searchItem.title.toLowerCase());
            return distance <= 80;
        });
        console.log(filteredSearchData);
        res.json(filteredSearchData);
    } catch (error) {
        console.error('Error fetching search data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
}

const searchByVideoId = async (req, res) => {
    try {

        const { videoId } = req.params;        
        console.log(videoId);
        const videoData = await Video.findOne({ videoId: { $regex: new RegExp(videoId, 'i') } });
        console.log(videoData);
        res.json(videoData);
    } catch (error) {
        console.error('Error fetching video data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
}

const searchByGenre = async (req, res) => {
    try {

        const { genre } = req.params;        
        console.log(genre);
        const genreData = await Video.find({ genre: { $regex: new RegExp(genre, 'i') } });
        console.log(genreData);
        res.json(genreData);
    } catch (error) {
        console.error('Error fetching genre data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { searchByEnquiry, searchByVideoId, searchByGenre }