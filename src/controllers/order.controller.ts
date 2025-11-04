// @ts-check

import { Request, Response } from 'express';
import log from "../utils/logger";
import { placeOrder } from '../services/order.service'

// CONTROLLERS: VALIDATION

export async function subscribeToOrderHandler(req: Request, res: Response) {
    
}

export async function placeOrderHandler(req: Request, res: Response) {
    try {
        await placeOrder(req.body);
    } catch (e) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}