const express = require('express');
const config = require('./config/config');
const dynamicController = require('./controllers/dynamicController');
const logger = require('./middleware/logger');
const routesConfig = require('./routes.json');
const delayResponse = require('./middleware/delayResponse');

const app = express();

// Middleware to parse JSON and log requests
app.use(express.json());
app.use(logger);
app.use(delayResponse);

// Dynamically setup routes based on routes.json
Object.keys(routesConfig).forEach((method) => {
  Object.keys(routesConfig[method]).forEach((route) => {
    app[method.toLowerCase()](route, dynamicController.handleRequest);
  });
});

// Start the server
app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}`);
});
