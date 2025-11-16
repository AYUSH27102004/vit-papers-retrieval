const express = require('express');
const cors = require('cors');
const githubPapers = require('./github_papers');
const codechefPapers = require('./codechef_papers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static frontend files
app.use(express.static('frontend'));

// Serve index.html at root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});


// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// GitHub Papers Search Endpoint
app.get('/api/github/search', async (req, res) => {
    try {
        const { courseCode, courseName, paperType } = req.query;
        
        console.log('📥 Received GitHub search request:', { courseCode, courseName, paperType });
        
        const results = await githubPapers.searchPapers({ 
            courseCode, 
            courseName, 
            paperType 
        });
        
        res.json({
            success: true,
            source: 'GitHub',
            count: results.length,
            papers: results
        });
    } catch (error) {
        console.error('❌ GitHub search error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to fetch papers from GitHub'
        });
    }
});

// CodeChef Papers Search Endpoint
app.get('/api/codechef/search', async (req, res) => {
    try {
        const { courseCode, courseName, paperType } = req.query;
        
        console.log('📥 Received CodeChef search request:', { courseCode, courseName, paperType });
        
        const results = await codechefPapers.searchCodeChefPapers({ 
            courseCode, 
            courseName, 
            paperType 
        });
        
        res.json({
            success: true,
            source: 'CodeChef-VIT',
            count: results.length,
            papers: results
        });
    } catch (error) {
        console.error('❌ CodeChef search error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to fetch papers from CodeChef'
        });
    }
});

// Combined search endpoint (searches both sources)
app.get('/api/search', async (req, res) => {
    try {
        const { courseCode, courseName, paperType, source } = req.query;
        
        console.log('📥 Received combined search request:', { courseCode, courseName, paperType, source });
        
        let allResults = [];
        
        // Search GitHub if source is 'github' or 'all'
        if (!source || source === 'github' || source === 'all') {
            try {
                const githubResults = await githubPapers.searchPapers({ 
                    courseCode, 
                    courseName, 
                    paperType 
                });
                allResults = allResults.concat(githubResults.map(p => ({ ...p, source: 'GitHub' })));
            } catch (error) {
                console.error('GitHub search failed:', error.message);
            }
        }
        
        // Search CodeChef if source is 'codechef' or 'all'
        if (!source || source === 'codechef' || source === 'all') {
            try {
                const codechefResults = await codechefPapers.searchCodeChefPapers({ 
                    courseCode, 
                    courseName, 
                    paperType 
                });
                allResults = allResults.concat(codechefResults);
            } catch (error) {
                console.error('CodeChef search failed:', error.message);
            }
        }
        
        res.json({
            success: true,
            count: allResults.length,
            papers: allResults
        });
    } catch (error) {
        console.error('❌ Combined search error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to fetch papers'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Papers Retrieval Backend Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 GitHub search: http://localhost:${PORT}/api/github/search`);
    console.log(`🔍 CodeChef search: http://localhost:${PORT}/api/codechef/search`);
    console.log(`🔍 Combined search: http://localhost:${PORT}/api/search`);
});
module.exports = app;
