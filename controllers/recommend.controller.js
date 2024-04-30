const Recommendations = require("../models/recommendations.model");
const Video = require("../models/video.model");

// Endpoint for updating recommendation data for a userId
const recommendationSet = async (req, res) => {
    const { userId, recommendationData } = req.body;
    try {
        let recommend = await Recommendations.findOne({ userId });

        if (!recommend) {
            console.log("Creating New Recommendation by SET");
            recommend = await createNewRecommendations(userId);
            await recommend.save();
            res.status(200).send({ message: 'Recommendations created successfully' });
        } else {
            updateData(recommend.recent, recommendationData, 5);
            updateData(recommend.overall, recommendationData, 10);
            await recommend.save();
            res.status(200).send({ message: 'Recommendations updated successfully' });
        }

    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


// Update recomendation data with new input data
const updateData = (data, formData, maximumSize) => {
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            if (Array.isArray(formData[key])) {
                data[key] = data[key] ? [...formData[key], ...data[key]] : [...formData[key]];

                if (data[key].length > maximumSize) {
                    data[key] = data[key].slice(-maximumSize);
                }
            }
        }
    }
}

const createNewRecommendations = async (userId) => {
    const newRecommendations = await Recommendations.create(
        { 
            userId: userId,
            recent: {
                genre: [
                    'Comedy',
                    'Adventure',
                    'Drama',
                ],
                director: [
                    'Rebecca Addelman',
                    'Kedar Korde',
                    'Andrew Nackman',
                ] 
            }, 
            overall: {
                genre: [
                    'Comedy',
                    'Adventure',
                    'Drama',
                ],
                director: [
                    'Rebecca Addelman',
                    'Kedar Korde',
                    'Andrew Nackman',
                ] 
            } 
        });
    
   
    console.log(newRecommendations);
    return newRecommendations;
}

// Endpoint to retrieve recommendation data for a userId
const recommendationGetOverall = async (req, res) => {
    const userId = req.params.userId;
    const type = req.query.type;
    const count = req.query.count;
    console.log(userId);
    console.log(type);
    console.log(count);
    try {
        let recommendData = await Recommendations.findOne({ userId });
        console.log(recommendData);
        if(recommendData){
            switch (type) {
                case 'genre':
                    
                    let recommendedGenre = [];
                    for(let countIndex = 0; countIndex < count; countIndex++){
                        console.log(recommendedGenre);
                        console.log(countIndex);
                        const genreOverallData = recommendData.overall.genre;
                        const genreOverallRandomChoiceNumber = Math.floor(Math.random() * (genreOverallData.length - 1)) + 0; 
                        const genreOverallChoice = genreOverallData[genreOverallRandomChoiceNumber];
                        const genreOverallTotalCount = await Video.countDocuments({ genre: { $regex: new RegExp(genreOverallChoice, 'i') } });
                        const genreOverallChanceNumber = Math.floor(Math.random() * (genreOverallTotalCount - 1)) + 0; 
                        const genreRecommendation = await Video.findOne({ genre: { $regex: new RegExp(genreOverallChoice, 'i') } }).skip(genreOverallChanceNumber).limit(1);
                        let testContents = false;
                        for(let totalIndex = 0; totalIndex < recommendedGenre.length; totalIndex++){
                            if(recommendedGenre[totalIndex].title === genreRecommendation.title){
                                testContents = true;
                            }
                        }
                        if(!genreRecommendation || testContents){
                            countIndex = countIndex - 1;
                        }
                        else {
                            recommendedGenre.push(genreRecommendation);
                        }
                    }

                    res.status(200).send(recommendedGenre);
                    break;
                case 'director':
                    let recommendedDirector = [];
                    for(let countIndex = 0; countIndex < count; countIndex++){
                        const directorOverallData = recommendData.overall.director;
                        const directorOverallRandomChoiceNumber = Math.floor(Math.random() * (directorOverallData.length - 1)) + 0;  
                        const directorOverallChoice = directorOverallData[directorOverallRandomChoiceNumber];
                        const directorOverallTotalCount = await Video.countDocuments({ genre: { $regex: new RegExp(directorOverallChoice, 'i') } });
                        const directorOverallChanceNumber = Math.floor(Math.random() * (directorOverallTotalCount - 1)) + 0; 
                        const directorRecommendation = await Video.findOne({ director: { $regex: new RegExp(directorOverallChoice, 'i') } }).skip(directorOverallChanceNumber).limit(1);
                        let testContents = false;
                        for(let totalIndex = 0; totalIndex < recommendedDirector.length; totalIndex++){
                            if(recommendedDirector[totalIndex].title === directorRecommendation.title){
                                testContents = true;
                            }
                        }
                        if(!genreRecommendation || testContents){
                            countIndex = countIndex - 1;
                        }
                        else {
                            recommendedDirector.push(directorRecommendation);
                        }
                    }
                    res.status(200).send(recommendedDirector);
                    break;
                default:
                    res.status(404).send('Invalid genre');
            }
        } else {
            console.log("Creating New Recommendation by OVERALL");
            recommendData = await createNewRecommendations(userId);
            await recommendData.save();
            res.status(200).send(recommendData);
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// Endpoint to retrieve recommendation data for a userId
const recommendationGetRecent = async (req, res) => {
    const userId = req.params.userId;
    const type = req.query.type;
    const count = req.query.count;
    try {
        let recommendData = await Recommendations.findOne({ userId });
        if(recommendData){
            switch (type) {
                case 'genre':
                    let recommendedGenre = [];
                    for(let countIndex = 0; countIndex < count; countIndex++){
                        const genreRecentData = recommendData.recent.genre;
                        const genreRecentRandomChoiceNumber = Math.floor(Math.random() * (genreRecentData.length - 1)) + 0; 
                        const genreRecentChoice = genreRecentData[genreRecentRandomChoiceNumber];
                        const genreRecentTotalCount = await Video.countDocuments({ genre: { $regex: new RegExp(genreRecentChoice, 'i') } });
                        const genreRecentChanceNumber = Math.floor(Math.random() * (genreRecentTotalCount - 1)) + 0; 
                        const genreRecomendation = await Video.findOne({ genre: { $regex: new RegExp(genreRecentChoice, 'i') } }).skip(genreRecentChanceNumber).limit(1);
                        let testContents = false;
                        for(let totalIndex = 0; totalIndex < recommendedGenre.length; totalIndex++){
                            if(recommendedGenre[totalIndex].title === genreRecommendation.title){
                                testContents = true;
                            }
                        }
                        if(!genreRecommendation || testContents){
                            countIndex = countIndex - 1;
                        }
                        else {
                            recommendedGenre.push(genreRecomendation);
                        }
                    }
                    res.status(200).send(recommendedGenre);
                    break;
                case 'director':
                    let recommendDirector = [];
                    for(let countIndex = 0; countIndex < count; countIndex++){
                        const directorRecentData = recommendData.recent.director;
                        const directorRecentRandomChoiceNumber = Math.floor(Math.random() * (directorRecentData.length - 1)) + 0;  
                        const directorRecentChoice = directorRecentData[directorRecentRandomChoiceNumber];
                        const directorRecentTotalCount = await Video.countDocuments({ genre: { $regex: new RegExp(directorRecentChoice, 'i') } });
                        const directorRecentChanceNumber = Math.floor(Math.random() * (directorRecentTotalCount - 1)) + 0; 
                        const directorRecommendation = await Video.findOne({ director: { $regex: new RegExp(directorRecentChoice, 'i') } }).skip(directorRecentChanceNumber).limit(1);
                        let testContents = false;
                        for(let totalIndex = 0; totalIndex < recommendedDirector.length; totalIndex++){
                            if(recommendedDirector[totalIndex].title === directorRecommendation.title){
                                testContents = true;
                            }
                        }
                        if(!directorRecommendation || testContents){
                            countIndex= countIndex - 1;
                        }
                        else {
                            recommendDirector.push(directorRecommendation);
                        }
                    }
                    res.status(200).send(recommendDirector);
                    break;
                default:
                    res.status(404).send('Invalid genre');
            }
        } else {
            recommendData = await createNewRecommendations(userId);
            await recommendData.save();
            res.status(200).send(recommendData);
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
} 

module.exports = { recommendationSet, recommendationGetOverall, recommendationGetRecent }