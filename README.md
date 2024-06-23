# ServerOps

The `ServerOps` is a chainable server implementation built on top of [Express.js](https://www.npmjs.com/package/express). It is designed to simplify the setup and management of an HTTP server by providing a clean, fluent API for defining routes and middleware. The `ServerOps` class integrates common middleware for [security](https://www.npmjs.com/package/helmet), [CORS](https://www.npmjs.com/package/cors), and body parsing out of the box, making it easy to build robust web applications quickly.

## Key Features
- **Chainable API**: Allows for method chaining to define routes and middleware in a concise manner.
- **Built-in Middleware**: Includes `helmet` for security, `cors` for handling cross-origin requests, and body parsers for JSON and URL-encoded data.
- **Error Handling**: Customizable error handling with the `ServerOpsError` class for consistent error responses.
- **Static File Serving**: Easy configuration for serving static files.
- **Modular and Extensible**: Supports adding custom middleware and chaining multiple server instances together.

## How It Works
1. **Initialization**: Create an instance of `ServerOps` with optional configuration for port and CORS settings.
2. **Define Routes**: Use methods like `GET`, `POST`, `PUT`, `DELETE`, and `use` to define routes and middleware.
3. **Launch Server**: Call the `launch` method to bind routes and start the server, optionally providing a callback function.

## What It's For
The `ServerOps` class is ideal for developers looking to quickly set up and manage an HTTP server with a clean and fluent API. It's suitable for building RESTful APIs, single-page applications, and other web services that require a robust and flexible server setup.

## Usage Examples

### Example 1: Basic Setup
```javascript
import ServerOps from "server-ops"

// Define routes using method chaining
ServerOps.init({ port: 3000, cors: '*' })
    .GET('/hello', (req, res) => res.send('Hello, World!'))
    .POST('/echo', (req, res) => res.json(req.body))
    .launch();
```

### Example 2: Adding Middleware and Static File Serving
```javascript
import ServerOps from "server-ops"

// Define routes
const routes = [
    server => server.GET('/api/data', (req, res) => res.json({ data: 'sample data' }))
];

// Create and configure the server
const server = new ServerOps({ port: 8080 }, routes);

// Add middleware
server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from the 'public' directory
server.static('/public', 'path/to/public');

// Launch the server
server.launch(() => {
    console.log('Server is running on port 8080');
});
```

### Example 3: Error Handling with ServerOpsError
```javascript
import ServerOps, {ServerOpsError} from "server-ops"

// Define routes
const routes = [
    server => server.GET('/api/error', (req, res) => {
        throw new ServerOpsError('Something went wrong!', 500);
    })
];

// Create and configure the server
const server = new ServerOps({ port: 3000 }, routes);

// Launch the server with error handling
server.launch(() => {
    console.log('Server is running on port 3000');
});
```

## Example 4: Chaining Multiple Instances of ServerOps
```javascript
import ServerOps from "server-ops"

// Define the first server instance with some routes
const server1 = ServerOps.init()
    .GET('/hello', (req, res) => res.send('Hello from server 1'))
    .POST('/data', (req, res) => res.json({ received: req.body }));

// Define the second server instance with additional routes
const server2 = ServerOps.init()
    .GET('/goodbye', (req, res) => res.send('Goodbye from server 2'))
    .PUT('/update', (req, res) => res.send('Update received'));

// Create a new server that chains together the other two server's we've already defined:
const server3 = Server.init({ port: 3000 }))
    .chain(server1)
    .chain(server2);

// Launch the combined server
server3.launch(() => {
    console.log('Server is running on port 3000 with routes from both instances');
});

```

## Example 5: Making HTTP Requests with ServerOpsRequest
```javascript
import {ServerOpsRequest} from "server-ops"

// Example GET request
ServerOpsRequest.GET({
    url: "https://api.example.com/data",
    params: { key: "value" },
    headers: { "Authorization": "Bearer token" },
    withCreds: true
}).then(data => {
    console.log(data);
}).catch(error => {
    console.error(error);
});

// Example POST request
ServerOpsRequest.POST({
    url: "https://api.example.com/data",
    params: { key: "value" },
    headers: { "Authorization": "Bearer token" },
    withCreds: true
}).then(data => {
    console.log(data);
}).catch(error => {
    console.error(error);
});
```

## Notice

`ServerOps` is still very much a work in progress with more testing that needs to be done. All docs are currently created by ChatGPT for now, because that's the world we are currently living in...
