# ServerOpsError Class

The `ServerOpsError` class is designed to handle errors in the `ServerOps` environment. It extends the native JavaScript `Error` class to include additional functionality for HTTP status codes, logging, and sending error responses in an Express application.


## Constructor

#### `constructor(message: string, statusCode: number)`

Creates an instance of `ServerOpsError`.

- `message` (string): The error message. Defaults to "Unknown Error".
- `statusCode` (number): The HTTP status code. Defaults to 500 if not provided or invalid.

## Properties

#### `statusCode`

- **Setter**: `set statusCode(statusCode: number): void`
  - Sets the HTTP status code. Defaults to 500 if the provided status code is not valid (not a number between 100 and 599).
  
- **Getter**: `get statusCode(): number`
  - Returns the HTTP status code.

## Instance Methods

#### `send(res: Express.Response): void`

Sends the error response using an Express `Response` object.

- `res` (Express.Response): The Express response object.

#### `reject(reject: Promise.reject): void`

Rejects a promise with this error.

- `reject` (Promise.reject): The reject function from a promise.

#### `log(cb?: ({message, code, timestamp}: {message: string, code: number, timestamp: string}) => void): this`

Logs the error message to the console, optionally using a custom callback.

- `cb` (function, optional): A callback function to format the log message. If not provided, a default format is used.
- **Returns**: `this` (the current instance of `ServerOpsError`).

## Static Methods

#### `static init(message: string, statusCode?: number): ServerOpsError`

Static factory method to create an instance of `ServerOpsError`.

- `message` (string): The error message.
- `statusCode` (number, optional): The HTTP status code. Defaults to 500.
- **Returns**: An instance of `ServerOpsError`.

#### `static timestamp(timeZone?: string): string`

Creates a timestamp from the current time.

- `timeZone` (string, optional): The time zone to use. Defaults to 'local'.
- **Returns**: A formatted timestamp string.