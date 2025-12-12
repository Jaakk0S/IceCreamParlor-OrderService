import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import log from "#src/utils/logger";
import routes from "#src/routes"
import { getDbConnection } from "#src/db/connection";
import { tableCreate, tableDrop, resetAutoIncrement } from "#src/db/iceCreamOrder.sql";
import { table } from "console";
import { initializeMessaging } from "./services/messaging.service";

export const createServer = (): express.Application => {
  dotenv.config();

  // Log NODE_ENV to console
  log.info(`./.env.${process.env.NODE_ENV}`)

  const app: express.Application = express();

  app
    .disable("x-powered-by")
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  app.use(cors());
  routes(app);

  initializeMessaging();

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  globalThis.Express = app;
  return app;
}

export const startServer = () => {
  let port: string = "8080";
  if (process.env.NODE_ENV == "dev")
    port = process.env.dev_port;

  let conn = getDbConnection();
  conn.raw(tableDrop).then(r => {
    conn.raw(tableCreate).then(r => {
      log.info("MySQL online, clean database initialized");
    });
  }).catch(err => {
    console.error(err);
  });

  globalThis.Server = globalThis.Express.listen(port, () => {
    log.info("App is listening at " + port);
  });
}

export const shutdown = () => {
  log.info("Shutting down...");
  if (globalThis.Server) {
    globalThis.Server.close((error: Error) => {
      log.info("Server closed. Cleanup complete.");
    });
  }
};
