const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Load routes from route.json
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'request/route.json'), 'utf8'));

// Function to handle GET requests for static JSON files
const getStaticData = (filePath) => {
    return (req, res) => {
        const fullPath = path.join(__dirname, 'database', filePath);
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading data' });
            }
            res.json(JSON.parse(data));
        });
    };
};

// Function to handle POST requests to append new data to static JSON files
const postStaticData = (filePath) => {
    return (req, res) => {
        const fullPath = path.join(__dirname, 'database', filePath);
        fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading data' });
            }
            const jsonData = JSON.parse(data);
            const newEntry = { id: jsonData.length + 1, ...req.body }; // Create new entry with an incremented ID
            jsonData.push(newEntry);

            // Write updated data back to the file
            fs.writeFile(fullPath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error writing data' });
                }
                res.status(201).json(newEntry);
            });
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