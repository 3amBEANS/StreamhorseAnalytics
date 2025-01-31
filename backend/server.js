const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// app.get('/', (req, res) => {
//     console.log('Here')
//     res.json({ message: "Error"})
//     res.render('index')
// })

// app.get("/api", (req, res) => {
//     res.json({"fruits": ["apple", "orange", "banana"]});
// });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
console.log(YOUTUBE_API_KEY)


// app.get('/', (req, res) => {
//     res.json({"fruits": ["apple", "orange", "banana"]});
// });

//Use CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST'],       // Allowed HTTP methods
    credentials: true               // If you need cookies or authentication
}));

app.use(express.json());


app.post('/api/channel-stats', async (req, res) => {
    const { channelUrl } = req.body;

    try {
        let channelId = null;

        if (channelUrl.includes('@')) {
            // Extract username from the URL
            const username = channelUrl.split('@')[1];
            console.log(`Extracted username: ${username}`);

            // Use the search endpoint to resolve the username to a channel ID
            const searchResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                params: {
                    part: 'snippet',
                    q: username,
                    type: 'channel',
                    key: YOUTUBE_API_KEY
                }
            });

            console.log('Response from YouTube API (search):', searchResponse.data);

            if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
                return res.status(404).json({ error: 'Channel not found for the given username.' });
            }

            // Get the channel ID from the search results
            channelId = searchResponse.data.items[0].id.channelId;
        } else {
            // Extract channel ID from the URL
            channelId = channelUrl.split('/').pop();
        }

        // Fetch channel statistics using the channel ID
        const statsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
            params: {
                part: 'statistics',
                id: channelId,
                key: YOUTUBE_API_KEY
            }
        });

        console.log('Response from YouTube API (channel statistics):', statsResponse.data);

        if (!statsResponse.data.items || statsResponse.data.items.length === 0) {
            return res.status(404).json({ error: 'Channel not found for the given ID.' });
        }

        // Extract statistics from the response
        const stats = statsResponse.data.items[0].statistics;
        res.json({
            views: stats.viewCount,
            subscribers: stats.subscriberCount
        });
    } catch (error) {
        console.error('Error fetching channel stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch channel statistics.' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});