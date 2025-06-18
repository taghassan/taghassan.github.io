const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const baseServerUrl='https://cysaw.org';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve index.html from the root
app.use(express.static(__dirname));


// Main Route - Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Main Route - Serve index.html
app.get('/games', (req, res) => {
    res.sendFile(path.join(__dirname, 'games.html'));
});


// Proxy endpoint
app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post(`${baseServerUrl}/api.php`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'PHPSESSID=03c89c3b775c0c1093737b55f8757c07'
                // 'Cookie': 'PHPSESSID=0a8789882cabdcf73ed74d65be89de8e'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


// Proxy endpoint
app.post('/proxy/mark_downloaded', async (req, res) => {
    try {

        const data=req.body

        console.log("mark_downloaded data ",data)

        const response = await axios.post(`${baseServerUrl}/mark_downloaded.php`,
            data,
            {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'PHPSESSID=03c89c3b775c0c1093737b55f8757c07'
                // 'Cookie': 'PHPSESSID=0a8789882cabdcf73ed74d65be89de8e'
            }
        });
        res.json(response?.data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Proxy API endpoint
app.get('/api/games', async (req, res) => {
    const { search = '', page = 1 } = req.query;
    try {
        const response = await axios.get(`${baseServerUrl}/gamelist.php?search=${search}&page=${page}&ajax=true`, {
            headers: {
                'Cookie': 'PHPSESSID=0a8789882cabdcf73ed74d65be89de8e'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game list.' });
    }
});

// Launch the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
