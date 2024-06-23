// Dependencies:
import axios from "axios";                                // For making HTTP requests
import ServerOpsError from "../ServerOpsError/index.js"   // For handling errors  

// Singleton for sending HTTP requests using Axios:
export default class ServerOpsRequest {

    // :: STRING, {url:STRING, params:OBJECT, headers:OBJECT, withCreds:BOOL} -> PROMISE
    // Send request using given method for given URL, params, headers and optional creds:
    static async send(method, {url, params, headers, withCreds}) {

        try {

            // Setup axios config regardless of method:
            let request = {
                "withCredentials":withCreds === true, // Only sets to TRUE if TRUE is given
                "url":url,
                "method":method,
                "headers":headers ?? {}
            }

            // Determines how parameters are set in axios config depending on method:
            switch (method.toLowerCase()) {
                case "post":
                    request.data = new URLSearchParams(params ?? {}).toString()
                break;
                case "get":
                    request.params = params ?? {};
                break;
                default:
                    throw new ServerOpsError(`Unsupported HTTP Method "${method}"`, 405);
            }

            // Make request and resolve promise with response:
            const res =  await axios(request);
            return res.data;

        } catch (err) {

            // How we handle the error depends on if error was thrown by axios or not:
            if (axios.isAxiosError(err)) {
               
                // Response recieved with error:
                if (err.response) {
                    const code = err.response.status;
                    const message = err.response.data.error !== undefined
                        ? err.response.data.error.message
                        : err.response.data 
                    throw new ServerOpsError(message, code);
                } else if (err.request) {
                    // Request was sent but response was never recieved:
                    const message = err.message || "No response received";
                    throw new ServerOpsError(message, 400);
                } else {
                    // Something else failed when trying to send request with axios:
                    const message = err.message || "Unknown Axios error";
                    throw new ServerOpsError(message, 500);
                }

            } else if (!(err instanceof ServerOpsError)) {
                
                // Something besides Axios failed:
                throw ServerOpsError.init(err.message, 500);
            
            } else {

                // Re-throw serverOpsError:
                throw err;

            }

        }

    }

    // :: {url:STRING, params:{key:value}, headers:{key:value}, withCreds:BOOL} -> PROMISE
    // Returns promise of GET request using given url, params, headers with optional creds:
    static GET({url, params, headers, withCreds}) {
       return  ServerOpsRequest.send("get", {url, params, headers, withCreds})
    }
    
    // :: {url:STRING, params:{key:value}, headers:{key:value}, withCreds:BOOL} -> PROMISE
    // Returns promise of POST request using given url, params, headers with optional creds:
    static POST({url, params, headers, withCreds}) {
        return  ServerOpsRequest.send("post", {url, params, headers, withCreds})
     }
    
}