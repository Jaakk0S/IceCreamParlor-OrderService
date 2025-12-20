// @ts-check

import * as express from 'express';
import waitUntil from 'async-wait-until';
import log from "#src/utils/logger";
import { getAllOrders } from '#src/services/order.service';
import { toDAO } from '#src/services/daos/daos';

let _orderUpdateCount: number = 0;

export const orderUpdated = () => {
    _orderUpdateCount++;
}

/*
    Waits until any order changes status. Then returns all orders.
*/
export async function orderStatusLongPollingHandler(req: express.Request, res: express.Response) {
    req.setTimeout(1000000);
    let startCount: number = _orderUpdateCount;
    req.on('close', () => {
        log.info('Client disconnected');
    });
    await waitUntil(() => startCount != _orderUpdateCount, { timeout: 1000000 });
    getAllOrders().then(orders => {
        res.json(orders.map(o => toDAO(o)));
    });
}
