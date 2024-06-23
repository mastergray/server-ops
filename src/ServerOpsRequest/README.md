## ServerOpsRequest Class

The `ServerOpsRequest` class is a singleton designed to send HTTP requests using Axios. It provides methods to send GET and POST requests and handles errors using the `ServerOpsError` class.

## Static Methods

#### `static async send(method: string, {url, params, headers, withCreds}: {url: string, params: object, headers: object, withCreds: boolean}): Promise`

Sends an HTTP request using the given method, URL, parameters, headers, and credentials.

- `method` (string): The HTTP method (e.g., "get", "post").
- `url` (string): The URL for the request.
- `params` (object, optional): The parameters for the request. Defaults to an empty object.
- `headers` (object, optional): The headers for the request. Defaults to an empty object.
- `withCreds` (boolean, optional): Indicates whether to include credentials with the request. Defaults to `false`.
- **Returns**: A promise that resolves with the response data.
- **Throws**: `ServerOpsError` if an error occurs during the request.

##### Example

```javascript
try {
    const data = await ServerOpsRequest.send("get", {
        url: "https://api.example.com/data",
        params: { key: "value" },
        headers: { "Authorization": "Bearer token" },
        withCreds: true
    });
    console.log(data);
} catch (error) {
    console.error(error);
}
```

#### `static GET({url, params, headers, withCreds}: {url: string, params: object, headers: object, withCreds: boolean}): Promise`

Sends a GET request using the given URL, parameters, headers, and credentials.

- `url` (string): The URL for the request.
- `params` (object, optional): The parameters for the request. Defaults to an empty object.
- `headers` (object, optional): The headers for the request. Defaults to an empty object.
- `withCreds` (boolean, optional): Indicates whether to include credentials with the request. Defaults to `false`.
- **Returns**: A promise that resolves with the response data.
- **Throws**: `ServerOpsError` if an error occurs during the request.

##### Example

```javascript
try {
    const data = await ServerOpsRequest.GET({
        url: "https://api.example.com/data",
        params: { key: "value" },
        headers: { "Authorization": "Bearer token" },
        withCreds: true
    });
    console.log(data);
} catch (error) {
    console.error(error);
}
```

#### `static POST({url, params, headers, withCreds}: {url: string, params: object, headers: object, withCreds: boolean}): Promise`

Sends a POST request using the given URL, parameters, headers, and credentials.

- `url` (string): The URL for the request.
- `params` (object, optional): The parameters for the request. Defaults to an empty object.
- `headers` (object, optional): The headers for the request. Defaults to an empty object.
- `withCreds` (boolean, optional): Indicates whether to include credentials with the request. Defaults to `false`.
- **Returns**: A promise that resolves with the response data.
- **Throws**: `ServerOpsError` if an error occurs during the request.

##### Example

```javascript
try {
    const data = await ServerOpsRequest.POST({
        url: "https://api.example.com/data",
        params: { key: "value" },
        headers: { "Authorization": "Bearer token" },
        withCreds: true
    });
    console.log(data);
} catch (error) {
    console.error(error);
}
```

### Error Handling

Errors encountered during the request are handled by the `ServerOpsError` class. The error handling differentiates between different types of Axios errors:

1. **Response Errors**: If the server responds with an error (e.g., 4xx or 5xx status codes), the `ServerOpsError` is thrown with the response status code and message.
2. **Request Errors**: If the request is made but no response is received, the `ServerOpsError` is thrown with a 400 status code and an appropriate message.
3. **Other Axios Errors**: If something else fails when trying to send the request with Axios, the `ServerOpsError` is thrown with a 500 status code and an appropriate message.
4. **Non-Axios Errors**: If an error occurs that is not an instance of `ServerOpsError`, a new `ServerOpsError` is thrown with a 500 status code and the error message.
