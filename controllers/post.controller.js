const Video = require("../models/video.model");

const updateAllVideoData = async (req, res) => {
    
    res.json({ success: true, filteredStreams: null });
    
    /*
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const channelId = 'UCX1nchEcBshItKBeJvH-YMw';
    //FREEMOVIES: UCX1nchEcBshItKBeJvH-YMw
    //WUTANG: UCUpbgPbDccjoB9PxI-nI7oA
    //MOVIECENTRAL: UCGBzBkV-MinlBvHBzZawfLQ
    //YOUTUBEMOVIES: UCuVPpxrm2VAgpH3Ktln4HXg
    const maxFetchCount = 10;
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

        await Video.deleteMany(); // Clear existing data
        const streamItems = filteredStreams.map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: {
                low: {
                    url: item.snippet.thumbnails.default.url,
                },
                medium: {
                    url: item.snippet.thumbnails.medium.url,
                },
                high: {
                    url: item.snippet.thumbnails.high.url,
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


        await Video.insertMany(streamItems);

        res.json({ success: true, filteredStreams: filteredStreams });

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    */
}



module.exports = { updateAllVideoData };