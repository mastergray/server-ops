// Dependencies:
import { DateTime } from 'luxon';   // Handles timestamps

// Implements generalized error handling for ServerOps:
export default class ServerOpsError extends Error {

    /* Instance Fields */

        _statusCode;    // HTTP status code of error
    
    // CONSTRUCTOR :: STRING, NUMBER -> this
    // NOTE: Default status code is a 500 "internal server error":
    constructor(message, statusCode) {
        super(message ?? "Unknown Error");
        this.statusCode = statusCode;
    }

    /**
     * 
     *  Properties
     *  
     */

    /*============*
     * statusCode *
     *============*/

    // SETTER :: NUMBER -> VOID
    set statusCode(statusCode) {

        // Check if status code is valid and default to 500 if it's not:
        const isValidStatusCode = typeof statusCode === 'number' && statusCode >= 100 && statusCode <= 599;
        if (isValidStatusCode === false) {
            console.log(`Invalid status code "${statusCode}" given - using 500 instead`)
        }

        // Set status code:
        this._statusCode = isValidStatusCode === true
            ? statusCode
            : 500
    }

    // GETTER :: VOID -> NUMBER
    get statusCode() {
        return this._statusCode
    }

    /**
     * 
     *  Instance Methods 
     * 
     */

    // :: Express.RESPONSE -> VOID
    // Sends error response using an Express RESPONSE object:
    send(res) {
        res.status(this.statusCode).json({
            "error":{"message":this.message}
        });  
    }

    // :: Promise.REJECT -> VOID
    // Rejects promise using this error:
    reject(reject) {
        reject(this);
    }

    // :: VOID|({message, code, timestamp} -> VOID) -> this
    // Writes error message console using optional callback:
    log(cb) {
        const consoleError = typeof(cb) === "function"
            ? cb({"message":this.message, "statusCode":this.statusCode, "timestamp":ServerOpsError.timestamp()})
            : `${ServerOpsError.timestamp()} | ${this.statusCode} - ${this.message}`
        console.error(consoleError)
        return this;
    }

    /**
     * 
     *  Static Methods 
     * 
     */

    // Static Factory Method :: STRING, NUMBER -> serverOpsError
    static init(message, statusCode) {
        return new ServerOpsError(message, statusCode);
    }

    // :: VOID -> STIRNG
    // Creates timestamp from current time:
    static timestamp(timeZone) {
        return DateTime.now()
            .setZone(timeZone ?? 'local')
            .toFormat('MM/dd/yyyy, hh:mm:ss a');
    }

}