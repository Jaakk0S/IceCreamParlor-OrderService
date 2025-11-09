// @ts-check

import express, { Application } from "express";
import log from "./utils/logger";
import routes from "./routes"

export const createServer = () => {
  //I reccomend doing a console.log as well to make sure the names match*
  console.log(`./.env.${process.env.NODE_ENV}`)

  const app:Application = express();

  app
    .disable("x-powered-by")
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  routes(app);

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  globalThis.Express = app;
  return app;
}

export const startServer = () => {
  globalThis.Server = globalThis.Express.listen(8080, () => {
    log.info("App is listening at 8080");
  });
}

export const shutdown = () => {
  console.log("Shutting down...");
  if (globalThis.Server) {
    globalThis.Server.close((error:Error) => {
      console.log("Server closed. Cleanup complete.");
      //process.exit(0);
    });
  }
};
