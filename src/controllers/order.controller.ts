// @ts-check

import { Request, Response, NextFunction } from 'express';
import log from "../utils/logger";
import { getOrder, placeOrder } from '../services/order.service'

export async function orderStatusHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { orderId } = req.params;
        await getOrder(orderId);
        next();
    } catch (e) {
        log.error(e.message);
        return res.status(409).send(e.message);
    }    
}

export async function placeOrderHandler(req: Request, res: Response, next: NextFunction) {
    try {
        await placeOrder(req.body);
        next();
    } catch (e) {
        log.error(e.message);
        return res.status(409).send(e.message);
    }
}