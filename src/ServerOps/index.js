// Dependencies:
import express from "express";                           // HTTP server framework
import cors from "cors";                                 // For managing CORS requests
import helmet from "helmet";                             // Basic server security
import os from "os";                                     // For getting  IP address of server
import { DateTime } from 'luxon';                        // Handles timestamps
import ServerOpsError from "../ServerOpsError/index.js";   // How to handle server errors 

// Implements "chainable" server that binds routes for recieving HTTP requests:
export default class ServerOps {

    /* Instance Fields */
    
        _port;      // Port number of express instance - defaults to 3000
        _cors;      // CORS config of express instane - defaults to UNDEFINED
        _app;       // Stores instance of express instance
        _routes;    // Stores routes to bind to an instance of express

    // CONSTRUCTOR :: {port:INT|VOID, cors:{"origin":URL, "credentials":BOOL}|"*"|VOID}, VOID|[(serverOps -> serverOps)] -> this
    constructor({port, cors}, routes) {
        this.port = port;
        this.cors = cors;
        this.routes = routes;
        this.app =  express();
    }

    /**
     * 
     *  Properties 
     * 
     */

    /*======*
     * port *
     *======*/

    // SETTER :: INT|VOID -> VOID
    // NOTE: Defaults to 3000 if port is VOID
    set port(port) {
        this._port = parseInt(port ?? 3000, 10);
    }

    // GETTER :: VOID -> INT
    get port() {
        return this._port;
    }

    /*======*
     * cors *
     *======*/

    // SETTER :: OBJECT|"*"|VOID -> VOID
    set cors(config) {
        this._cors = config === "*" ? {} : config;
        if (config === "*") {
            console.log("Notice: CORS is enabled for ALL origins!");
        }
    }
    

    // GETTER :: VOID -> VOID|cors
    get cors() {
        return this._cors;
    }

    /*=====*
     * app *
     *=====*/

    // SETTER :: express.app -> VOID
    // NOTE: app should be set AFTER cors to ensure CORS middleware is set by instance of express app:
    set app(app) {

        // Initialize "helmet" for standard security:
        // https://expressjs.com/en/advanced/best-practice-security.html
        app.use(helmet());

        // Middleware for CORS:
        if (this.cors !== undefined) {
            app.use(cors(this.cors));
        }

        // Middleware to parse JSON request bodies
        app.use(express.json());

        // Middleware to parse URL-encoded request bodies
        // NOTE: This will only parse requests from x-www-form-urlencoded, NOT form-data - to do that you need something like express-fileupload
        app.use(express.urlencoded({ extended: true }));

        // Store app in instance field:
        this._app = app;

    }

    // GETTER :: VOID -> express.app
    get app() {
        return this._app;
    }

    /*========*
     * routes *
     *========*/

    // SETTER :: [(serverOps -> serverOps)]|VOID -> VOID
    set routes(routes) {
        this._routes = routes ?? [];
    }

    // GETTER :: VOID -> [(serverOps -> serverOps)]
    get routes() {
        return this._routes;
    }

    /**
     * 
     *  Lookups (GETTERS with no SETTERS)
     * 
     */

    // :: VOID -> serverOpsError
    // NOTE: This is so we can have a shared error handler between routes
    // NOTE: By defining the error handle, we can use "instanceof" to ensure the error is of the right type if the function that throws an error is being called in a different context, which - if we were only checking the consturtor namee - could be an instance of some other type then
    get error() {
        return ServerOpsError; 
    }

    /**
     * 
     *  Instace Methods 
     * 
     */

    // :: STRING, STRING, FUNCTION -> this
    // Binds route to express instance for given method:
    bindRoute(method, route, fn) {
        
        this.routes.push(server => {
            server.app[method](route, async (req, res,next) => {
                try {
                    await fn.call(server, req, res, next);
                } catch (err) {
                    if (err instanceof server.error) {
                        err.log().send(res);
                    } else {
                        next(err);
                    }
                }
            });
            return server;
        });

        return this;

    }

    // :: (express.request, express.response, express.next -> VOID) -> this
    // Binds function to handle GET request to given route:
    // NOTE: Route handling function will be called in the conext of "this" serverOps instance
    GET(route, fn) {
        return this.bindRoute("get", route, fn);
    }

    // :: (express.request, express.response, express.next -> VOID) -> this
    // Binds function to handle POST request to given route:
    // NOTE: Route handling function will be called in the conext of "this" serverOps instance
    POST(route, fn) {
        return this.bindRoute("post", route, fn);
    }

    // :: (express.request, express.response, express.next -> VOID) -> this
    // Binds function to handle PUT request to given route:
    // NOTE: Route handling function will be called in the conext of "this" serverOps instance
    PUT(route, fn) {
        return this.bindRoute("put", route, fn);
    }

    // :: (express.request, express.response, express.next -> VOID) -> this
    // Bound function to handle DELETE request to given route:
    // NOTE: Route handling function will be called in the conext of "this" serverOps instance
    DELETE(route, fn) {
        return this.bindRoute("delete", route, fn);
    }

    // @Overload :: STRING:route, (req, res, next -> VOID) -> this
    // @Overload :: (req, res, next -> VOID)  -> this 
    // Bind middleware to express instance using optional route:
    use(...args) {
        const [route, fn] = args.length === 2 ? args : [null, args[0]];
        this.routes.push(server => {
            route ? server.app.use(route, fn) : server.app.use(fn);
            return server;
        });
        return this;
    }


    // :: STRING, STRING -> this
    // Statically serves files for the given route from the given directory:
    static(route, dirname) {
        return this.use(route, express.static(dirname))
    }
    
    // :: serverOps -> this
    // Appends the routes of the given server instance to the routes of this serverOps instance:
    chain(server) {
        this.routes = this.routes.concat(server.routes);
        return this;
    }

    // :: FUNCTION|VOID -> VOID
    // Binds additional routes and starts server:
    launch(cb) {

        // Bind routes to app:
        this.routes.reduce((server, route) => route(server), this);

        // File not found route:
        this.app.use("*", (req, res, next) => {
            res.status(404).send("Route Does Not Exist")
        });

        // Catch all error handler:
        // NOTE: This is triggered by next(err):
        this.app.use((err, req, res, next) => {
            if (err instanceof this.error) {
                err.log().send(res);
            } else {
                console.error(err);
                res.status(500).send("Internal Server Error");
            }
        });

        // Start server and show "banner" message:
        this.app.listen(this.port, () => {
            if (typeof(cb) === "function") {
                cb(this);
            } else {
                console.log(`Started on ${ServerOps.timestamp()}`);
                console.log(`Running from http://${ServerOps.getIPAddress()}:${this.port}...`);
            }
        });

    }
   
    /**
     * 
     *  Static Methods
     * 
     */

    // Static Factory Method :: OBJECT|VOID -> serverOps
    static init(config) {
        return new ServerOps(config ?? {});
    }

    // :: VOID -> STRING
    // Returns IP address for server:
    static getIPAddress() {

        const interfaces = os.networkInterfaces();

        if (!interfaces) {
            return 'Unable to determine IP address';
        }

        for (const iface of Object.values(interfaces)) {
            for (const entry of iface) {
                if (entry.family === 'IPv4' && !entry.internal) {
                    return entry.address;
                }
            }
        }

        return 'Unable to determine IP address';

    }

    // :: VOID -> STIRNG
    // Creates timestamp from current time:
    static timestamp(timeZone) {
        return DateTime.now()
            .setZone(timeZone ?? 'local')
            .toFormat('MM/dd/yyyy, hh:mm:ss a');
    }

}
