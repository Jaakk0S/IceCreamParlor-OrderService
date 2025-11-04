// @ts-check

import * as express from "express";
import log from "./utils/logger";
import routes from "./routes"
//import createError from "http-errors";

//const indexRouter = require('./routes/index');
//const orderRouter = require('./routes/orders');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use('/', indexRouter);
//app.use('/order', orderRouter);


// CREATE ERROR HANDLERS ! 

app.listen(8080, () => {
  log.info("App is listening at 8080");

  // CREATE MYSQL CONNECTION HERE

  routes(app);

})

export default app;
