const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  const logFilePath = path.join(__dirname, '../logs/application.log');
  const logEntry = `${new Date().toISOString()} - ${req.ip} - ${req.method} - ${req.originalUrl} - ${JSON.stringify(req.body)} - [${JSON.stringify(req.headers)}]\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("Logging error: ", err);
  });

  next();
};
