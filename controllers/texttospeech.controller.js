const openai = require('openai');
require('dotenv').config()

const openaiApiKey = process.env.REACT_APP_GPT_API_KEY;
const openaiClient = new openai.OpenAI({ apiKey: openaiApiKey });

const convertToAudio = async (req, res) => {
    const { voice, text } = req.body;
    
    const response = await openaiClient.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: text,
        format: "opus",
    });

    console.log("generating streaming audio for: ", text);

    res.writeHead(200, {
        "Content-Type": "audio/ogg",
        "Transfer-Encoding": "chunked",
    });

    const readableStream = response.body;

    // Pipe the readable stream to the response
    readableStream.pipe(res);


    readableStream.on("end", () => {
        console.log(`Stream ended.`);
        res.end();
    });

    readableStream.on("error", (e) => {
        res.end();
        console.error("Error streaming TTS:", e);
    });
};

module.exports = { convertToAudio }