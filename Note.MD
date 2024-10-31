To create a mock API in Node.js that allows you to serve static JSON files as endpoints without using `json-server`, you can follow these steps. This implementation will enable you to dynamically define routes and serve corresponding JSON files, similar to `json-server`, but fully implemented with your code.

### Step 1: Set Up Your Node.js Project

1. **Create a new directory and initialize a Node.js project**:

   ```bash
   mkdir dynamic-static-mock-api
   cd dynamic-static-mock-api
   npm init -y
   ```

2. **Install Express**:

   ```bash
   npm install express body-parser fs path
   ```

### Step 2: Create the Directory Structure

Create the following structure within your project:

```
dynamic-static-mock-api/
│
├── database/
│   ├── application.json
│   ├── applicationset.json
│   └── users.json
├── request/
│   └── route.json
├── server.js
└── package.json
```

### Step 3: Create the Database JSON Files

In the `database` folder, create the following JSON files with sample data:

**`application.json`**:

```json
[
    { "id": 1, "name": "Application One" },
    { "id": 2, "name": "Application Two" }
]
```

**`applicationset.json`**:

```json
[
    { "id": 1, "setting": "Setting One" },
    { "id": 2, "setting": "Setting Two" }
]
```

**`users.json`**:

```json
[
    { "id": 1, "username": "user1" },
    { "id": 2, "username": "user2" }
]
```

### Step 4: Create the `route.json` File

In the `request` folder, create a file named `route.json` to define your API routes:

```json
{
    "GET": {
        "/api/test/getapp": "application.json",
        "/api/test/getappset": "applicationset.json",
        "/api/test/getusers": "users.json"
    },
    "POST": {
        "/api/test/getapp": "application.json",
        "/api/test/getappset": "applicationset.json"
    }
}
```

### Step 5: Create the Server Logic

In the root directory, create a file named `server.js` to set up the Express server dynamically:

```javascript
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
```

### Step 6: Run the Server

1. **Start the server**:

   ```bash
   node server.js
   ```

2. **Test the API**:

   You can use tools like Postman or curl to test your endpoints:

   - **GET** `http://localhost:3000/api/test/getapp` to fetch applications.
   - **GET** `http://localhost:3000/api/test/getappset` to fetch application settings.
   - **GET** `http://localhost:3000/api/test/getusers` to fetch users.
   - **POST** `http://localhost:3000/api/test/getapp` with a JSON body like `{"name": "New Application"}` to add a new application.

### Conclusion

You now have a fully functional dynamic mock API setup in Node.js that serves static JSON files and handles GET and POST requests based on a configuration file. You can easily update the `route.json` file to add or modify routes and database files. Let me know if you have any questions or need further assistance!