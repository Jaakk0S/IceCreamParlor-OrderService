// @ts-check

import express, { Application } from "express";
import log from "./utils/logger";
import routes from "./routes"
//import createError from "http-errors";

//const indexRouter = require('./routes/index');
//const orderRouter = require('./routes/orders');

const app:Application = express();
const httpPort = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use('/', indexRouter);
//app.use('/order', orderRouter);


// CREATE ERROR HANDLERS ! 

const server = app.listen(8080, () => {
  log.info("App is listening at 8080");

  // CREATE MYSQL CONNECTION HERE

  routes(app);

})

const shutdown = () => {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Server closed. Cleanup complete.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export {
  app, server, httpPort, shutdown
}

