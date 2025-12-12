// @ts-check

import * as express from 'express';
import { connections } from '#src/services/order.service';
import log from "#src/utils/logger";


export async function orderStreamHandler(req: express.Request, res: express.Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    connections.set(req, res);

    req.on('close', () => {
        connections.delete(req);
        log.info('Client disconnected');
    });
}

