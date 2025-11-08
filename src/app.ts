// @ts-check

import express, { Application } from "express";
import log from "./utils/logger";
import routes from "./routes"


// useless?
/*if (process.env.NODE_ENV == undefined) {
  console.error("Set NODE_ENV variable");
  process.exit(1);
}
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })
*/



//I reccomend doing a console.log as well to make sure the names match*
console.log(`./.env.${process.env.NODE_ENV}`)

const app:Application = express();
const httpPort = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = app.listen(8080, () => {
  log.info("App is listening at 8080");
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

