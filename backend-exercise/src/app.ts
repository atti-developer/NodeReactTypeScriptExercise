import express from "express";
import { Request, Response, NextFunction } from "express";
const app = express();
import helmet from "helmet";
import bodyParser from 'body-parser'

import connectorDb from "./Config/Dbconnector";
import * as dotenv from "dotenv";
import Customer from './Routes/CustomerRoutes'
// import UserRoute from "./Routes/UserRoute";


dotenv.config();


app.use(helmet() as express.RequestHandler);
// app.use(bodyParser.urlencoded({ extended: false }) as express) 
app.use(express.json() as express.RequestHandler) // To parse the incoming requests with JSON payloads


//morgan used for logging
// app.use(morgan("dev"));
// app.use(morgan<Request, Response>("dev"));

console.log(process.env.DB_URI)
const dbConnectionString: string = process.env.DB_URI ?? "";

connectorDb(dbConnectionString);


app.use("/api/customer", Customer);


app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization,device_token,device_type,language,timezone');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

//404 response
app.use((error: any, res: Response, next: NextFunction) => {
    try {
        res.status(404).send("Resource not found");
    } catch (error) {
        next(error);
    }
});

app.use((error: any, res: Response, next: NextFunction) => {
    try {
        const status = error.status || 500;
        const message =
            error.message ||
            "There was an error while processing your request, please try again";
        return res.status(status).send({
            status,
            message,
        });
    } catch (error) {
        next(error);
    }
});
const server_port = process.env.PORT ?? "0.0.0.0";

const port = server_port || 5000;
app.listen(port, () => {
    console.log(`Application started on ${port}...`);
});

export default app;
