const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  const startTime = process.hrtime(); // Start timing the request
  const specificDate = new Date();
  const formattedDate = specificDate.toISOString().split('T')[0];
  const logFilePath = path.join(__dirname, '../logs', `${formattedDate}.log`);

  // Create a log entry function to format the log string
  const createLogEntry = () => {
    const duration = process.hrtime(startTime);
    const responseTime = (duration[0] * 1e3 + duration[1] * 1e-6).toFixed(3); // Convert to milliseconds
    const logEntry = [
      `Date: ${specificDate.toISOString().split('T')[0]}`,
      `Time: ${specificDate.toISOString().split('T')[1].split('.')[0]}`,
      `IP: ${req.ip}`,
      `Method: ${req.method}`,
      `URL: ${req.originalUrl}`,
      `Query: ${JSON.stringify(req.query)}`,
      `Status: ${res.statusCode}`,
      `User-Agent: ${req.headers['user-agent']}`,
      `Referrer: ${req.headers['referer'] || 'N/A'}`,
      `Response Time: ${responseTime} ms`
    ].join('  |  ');

    return `${logEntry}\n`;
  };

  // Listen for the response to log status code
  res.on('finish', () => {
    const logEntry = createLogEntry();
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error("Logging error: ", err);
      }
    });
  });

  next();
};
