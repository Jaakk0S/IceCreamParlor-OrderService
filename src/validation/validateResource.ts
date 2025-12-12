import e from "express";
import { ZodObject } from "zod";
import { fromError } from "zod-validation-error";
import log from "#root/src/utils/logger";

export const validate = (schema: ZodObject) => (req: e.Request, res: e.Response, next: e.NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (e) {
        const validationError = fromError(e).toString();
        log.error(validationError);
        res.status(400).send(JSON.stringify(validationError));
    }
};