// @ts-check

import * as express from "express";
import cors from "cors";
import { validate } from "#src/validation/validateResource";
import { orderStatusHandler, placeOrderHandler } from "#src/controllers/order.controller";
import { orderStatusLongPollingHandler } from "#src/controllers/order.stream.controller";
import { placeOrderSchema } from "#src/validation/dtoSchemas";

const whitelist: string[] = process.env.cors_whitelist.split(',');
const corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        console.log(originIsWhitelisted);
        callback(null, originIsWhitelisted);
    }
}

function routes(app: express.Application) {
    app.get('/order/v1/healthcheck', cors(corsOptions), (req: express.Request, res: express.Response) => res.sendStatus(200));
    app.get('/order/v1/status/:orderId', cors(corsOptions), orderStatusHandler);
    app.get('/order/v1/stream', cors(corsOptions), orderStatusLongPollingHandler);
    app.post('/order/v1/place', cors(corsOptions), validate(placeOrderSchema), placeOrderHandler);
}

export default routes;