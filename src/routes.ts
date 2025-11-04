// @ts-check

import { Express, Request, Response } from "express";

function routes(app: Express) {
    app.get('/order/v1/healthcheck', (req: Request, res: Response) => res.sendStatus(200));
    app.post('/order/v1/place')
}

export default routes;