const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  const specificDate = new Date(Date.now());
  console.log(specificDate);
  const formattedDate = specificDate.toISOString().split('T')[0];
  const logFilePath = path.join(__dirname, '../logs', `${formattedDate}.log`);
  // const logEntry = `${specificDate.toISOString()} - ${req.ip} -  ${req.method} - ${req.originalUrl} - ${JSON.stringify(req.body)} -  [${JSON.stringify(req.headers)}] \n`;
  // const logEntry = `${specificDate.toISOString()} - ${req.ip} -  ${req.method} - ${req.originalUrl} - ${res.statusCode}  \n`;
  // const logEntry = `${req.ip} - ${formattedDate} - ${specificDate.toISOString()} - ${req.method} - ${req.originalUrl} - ${res.statusCode} - User-Agent: ${req.headers['user-agent']} - Referrer: ${req.headers['referer'] || 'N/A'}\n`;

  const logEntry = [
    `IP: ${req.ip}`,
    `Date: ${specificDate.toISOString().split('T')[0]}`,
    `Time: ${specificDate.toISOString().split('T')[1].split('.')[0]}`,
    `Method: ${req.method}`,
    `URL: ${req.originalUrl}`,
    `Query: ${JSON.stringify(req.query)}`,
    `Status: ${res.statusCode}`,
    `User-Agent: ${req.headers['user-agent']}`,
    `Referrer: ${req.headers['referer'] || 'N/A'}`,
  ].join(' | ');

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Logging error: ", err);
    }
  });
  next();
};
