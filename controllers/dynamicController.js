const fs = require('fs');
const path = require('path');

// Load routes configuration
const routesConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../routes.json'), 'utf-8'));

function getResponseFile(filePath) {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../responses', filePath), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { error: 'Response file not found or invalid JSON' };
  }
}

exports.handleRequest = (req, res) => {

  // res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1
  // res.setHeader('Pragma', 'no-cache'); // HTTP 1.0
  // res.setHeader('Expires', '0'); // Proxies
  // res.setHeader('Access-Control-Allow-Origin', '*');

  // Get the request method and URL
  const method = req.method;
  const url = req.originalUrl;

  // Get the corresponding response file from routesConfig
  const responseFile = routesConfig[method] && routesConfig[method][url];

  if (responseFile) {
    const data = getResponseFile(responseFile);
    res.json(data);
    //res.status(200).json(data);
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
};
