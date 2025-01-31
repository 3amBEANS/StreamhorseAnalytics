import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
    const [channelUrl, setChannelUrl] = useState('');
    const [stats, setStats] = useState(null);

    const fetchChannelStats = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/channel-stats', {
                channelUrl
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching channel stats:', error);
        }
    };

    return (
        <div className="container">
            <div className="search-container">
                <h1>YouTube Channel Stats</h1>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Enter YouTube channel URL"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                />
                <button className="search-button" onClick={fetchChannelStats}>
                    Get Stats
                </button>
            </div>
            {stats && (
                <div className="stats-container">
                    <p>Views: {stats.views}</p>
                    <p>Subscribers: {stats.subscribers}</p>
                </div>
            )}
        </div>
    );
};

export default App;
