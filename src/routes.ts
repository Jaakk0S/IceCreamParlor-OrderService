// @ts-check

import { Application, Request, Response, NextFunction } from "express";
import { validate } from "./validation/validateResource";
import { placeOrderSchema } from "./validation/placeOrder.schema";
import { orderStatusHandler, placeOrderHandler } from "./controllers/order.controller";


function routes(app: Application) {
    app.get('/order/v1/healthcheck', (req: Request, res: Response) => res.sendStatus(200));
    app.get('/order/v1/status/:orderId', orderStatusHandler);
    app.post('/order/v1/place', validate(placeOrderSchema), placeOrderHandler);
}

export default routes;