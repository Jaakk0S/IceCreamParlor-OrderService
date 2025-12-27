// @ts-check

import * as express from "express";
import { validate } from "#src/validation/validateResource";
import { orderStatusHandler, placeOrderHandler } from "#src/controllers/order.controller";
import { orderStatusLongPollingHandler } from "#src/controllers/order.stream.controller";
import { placeOrderSchema } from "#src/validation/dtoSchemas";

function routes(app: express.Application) {
    app.get('/order/v1/healthcheck', (req: express.Request, res: express.Response) => res.sendStatus(200));
    app.get('/order/v1/status/:orderId', orderStatusHandler);
    app.get('/order/v1/stream', orderStatusLongPollingHandler);
    app.post('/order/v1/place', validate(placeOrderSchema), placeOrderHandler);
}

export default routes;