// @ts-check

import * as express from 'express';
import log from "#src/utils/logger";
import { getAllOrders } from '../services/order.service';
import { toDAO } from '../services/daos/daos';
import waitUntil from 'async-wait-until';

let _orderUpdateCount: number = 0;

export const orderUpdated = () => {
    _orderUpdateCount++;
}

/*
    Waits until any order changes status. Then returns all orders.
*/
export async function orderStatusLongPollingHandler(req: express.Request, res: express.Response) {
    let startCount: number = _orderUpdateCount;
    req.on('close', () => {
        log.info('Client disconnected');
    });
    await waitUntil(() => startCount != _orderUpdateCount);
    getAllOrders().then(orders => {
        res.json(orders.map(o => toDAO(o))).send(200);
    });
}
