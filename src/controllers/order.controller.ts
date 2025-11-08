// @ts-check

import { NextFunction, Request, Response } from 'express';
import log from "../utils/logger";
import { getOrder, placeOrder } from '../services/order.service'
import { toDAO, toModel } from '../services/daos/daos';

export async function orderStatusHandler(req: Request, res: Response) {
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

export async function placeOrderHandler(req: Request, res: Response) {
    await placeOrder(toModel(req.body)).then(result => {
        const dao = toDAO(result); 
        res.status(201).send(dao);
    }).catch(e => {
        log.error(e.message);
        res.sendStatus(409);
    });
}