// @ts-check

import * as express from 'express';
import log from "#src/utils/logger";
import { getOrder, placeOrder } from '#src/services/order.service'
import { toDAO, toModel } from '#src/services/daos/daos';

export async function orderStatusHandler(req: express.Request, res: express.Response) {
    try {
        const { orderId } = req.params;
        await getOrder(+orderId).then(result => {
            const dao = toDAO(result);
            res.status(200).send(dao);
        }).catch(e => {
            log.error(e.message);
            res.sendStatus(404);
        });
    } catch (e) {
        log.error(e.message);
        return res.status(409).send(e.message);
    }
}

export async function placeOrderHandler(req: express.Request, res: express.Response) {
    await placeOrder(toModel(req.body)).then(result => {
        const dao = toDAO(result);
        res.status(201).send(dao);
    }).catch(e => {
        log.error(e.message);
        res.sendStatus(409);
    });
}