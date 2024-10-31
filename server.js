const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to handle CORS
// Middleware to handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Add Authorization header
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow specific HTTP methods

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond with 200 OK for OPTIONS requests
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

// Register GET routes dynamically
for (const [route, fileName] of Object.entries(routes.GET || {})) {
    app.get(route, getStaticData(fileName));
}

// Start the server
app.listen(port, () => {
    console.log(`Mock API running at http://localhost:${port}`);
});
