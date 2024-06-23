# ServerOps Class

The `ServerOps` class is designed to provide a chainable, configurable server implementation using Express.js. It includes features for managing routes, handling CORS, adding middleware, and managing errors.

## Constructor

#### `constructor({port, cors}, routes)`

Creates an instance of `ServerOps`.

- `port` (number, optional): The port number for the Express instance. Defaults to 3000.
- `cors` (object|string, optional): The CORS configuration for the Express instance. Can be an object or `"*"`. Defaults to `undefined`.
- `routes` (array, optional): An array of functions to bind routes to the Express instance. Defaults to an empty array.

## Properties

#### `port`

- **Setter**: `set port(port: number | void): void`
  - Sets the port number. Defaults to 3000 if `port` is not provided.
  
- **Getter**: `get port(): number`
  - Returns the port number.

#### `cors`

- **Setter**: `set cors(config: object | "*" | void): void`
  - Sets the CORS configuration. If `config` is `"*"`, enables CORS for all origins.
  
- **Getter**: `get cors(): object | void`
  - Returns the CORS configuration.

#### `app`

- **Setter**: `set app(app: express.Application): void`
  - Sets up the Express app with middleware for security, CORS, and body parsing.
  
- **Getter**: `get app(): express.Application`
  - Returns the Express app instance.

#### `routes`

- **Setter**: `set routes(routes: array | void): void`
  - Sets the routes to be bound to the Express instance. Defaults to an empty array.
  
- **Getter**: `get routes(): array`
  - Returns the array of routes.

#### `error`

- **Getter**: `get error(): ServerOpsError`
  - Returns the custom error handler class, `ServerOpsError`.

## Instance Methods

#### `bindRoute(method: string, route: string, fn: function): this`

Binds a route to the Express instance for the given method.

- `method` (string): The HTTP method (e.g., "get", "post").
- `route` (string): The route path.
- `fn` (function): The handler function for the route.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `GET(route: string, fn: function): this`

Binds a function to handle GET requests to the given route.

- `route` (string): The route path.
- `fn` (function): The handler function for the route.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `POST(route: string, fn: function): this`

Binds a function to handle POST requests to the given route.

- `route` (string): The route path.
- `fn` (function): The handler function for the route.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `PUT(route: string, fn: function): this`

Binds a function to handle PUT requests to the given route.

- `route` (string): The route path.
- `fn` (function): The handler function for the route.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `DELETE(route: string, fn: function): this`

Binds a function to handle DELETE requests to the given route.

- `route` (string): The route path.
- `fn` (function): The handler function for the route.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `use(route: string | void, fn: function): this`

Binds middleware to the Express instance using an optional route.

- `route` (string, optional): The route path.
- `fn` (function): The middleware function.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `static(route: string, dirname: string): this`

Serves static files for the given route from the given directory.

- `route` (string): The route path.
- `dirname` (string): The directory path.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `chain(server: ServerOps): this`

Appends the routes of the given server instance to the routes of the current instance.

- `server` (ServerOps): Another instance of `ServerOps`.
- **Returns**: `this` (the current instance of `ServerOps`).

#### `launch(cb?: function): void`

Binds additional routes and starts the server.

- `cb` (function, optional): A callback function to be executed after the server starts.

## Static Methods

#### `static init(config: object | void): ServerOps`

Static factory method to create an instance of `ServerOps`.

- `config` (object, optional): Configuration object. Defaults to an empty object.
- **Returns**: An instance of `ServerOps`.

#### `static getIPAddress(): string`

Returns the IP address for the server.

- **Returns**: A string representing the IP address.

#### `static timestamp(timeZone?: string): string`

Creates a timestamp from the current time.

- `timeZone` (string, optional): The time zone to use. Defaults to 'local'.
- **Returns**: A formatted timestamp string.