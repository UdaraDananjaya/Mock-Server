const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Load routes from route.json
let routes = {};

try {
    const routesPath = path.join(__dirname, 'request', 'route.json');
    routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
} catch (error) {
    console.error('Error loading routes:', error);
}

// Function to handle GET requests for static JSON files
const getStaticData = (filePath) => {
    return (req, res) => {
        const fullPath = path.join(__dirname, 'database', filePath);
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading data' });
            }

            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseError) {
                res.status(500).json({ message: 'Error parsing JSON data' });
            }
        });
    };
};

// Function to handle POST requests for static JSON files
const postStaticData = (filePath) => {
    return (req, res) => {
        const fullPath = path.join(__dirname, 'database', filePath);
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading data' });
            }

            try {
                const jsonData = JSON.parse(data);
                // Simulate response without modifying original data
                res.status(200).json(jsonData);
            } catch (parseError) {
                res.status(500).json({ message: 'Error parsing JSON data' });
            }
        });
    };
};

// Register GET and POST routes dynamically
for (const [method, routesObject] of Object.entries(routes)) {
    for (const [route, fileName] of Object.entries(routesObject)) {
        if (method === 'GET') {
            app.get(route, getStaticData(fileName));
        } else if (method === 'POST') {
            app.post(route, postStaticData(fileName));
        }
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Mock API running at http://localhost:${port}`);
});
