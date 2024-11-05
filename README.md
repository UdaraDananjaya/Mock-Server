# Express Logging Middleware Application

This is a simple Express application that demonstrates how to set up dynamic routing and middleware for logging and response delay.

## Features

- **Dynamic Routing**: Routes are configured based on a `routes.json` file.
- **Request Logging**: All incoming requests are logged using a custom middleware.
- **Response Delay**: A middleware to introduce a delay in responses for testing purposes.
- **JSON Parsing**: Automatically parses incoming JSON requests.

## Requirements

- Node.js
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/UdaraDananjaya/Mock-Server.git
   cd Mock-Server

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `routes.json` file to define your routes. Here’s an example:
   ```json
   {
     "GET": {
       "/api/example": "Example handler"
     },
     "POST": {
       "/api/example": "Example handler"
     }
   }
   ```

## Usage

To start the application, run:

```bash
npm run dev
```

You should see a message indicating the server is running:

```
Server running at http://127.0.0.1:3000
```

## Middleware

### Logger

The logger middleware logs each incoming request with its method and URL.

### Delay Response

The delay response middleware introduces a specified delay before sending a response, useful for simulating slow network conditions.

## Contributing

If you’d like to contribute, please fork the repository and submit a pull request.