// @ts-check

import * as express from 'express';
import { activeLongPolls } from '#src/services/order.service';
import log from "#src/utils/logger";


export async function orderStatusLongPollingHandler(req: express.Request, res: express.Response) {

    activeLongPolls.set(req, res);

    req.on('close', () => {
        activeLongPolls.delete(req);
        log.info('Client disconnected');
    });
}
