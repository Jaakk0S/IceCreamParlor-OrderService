import e from "express";
import { ZodObject } from "zod";

export const validate = (schema: ZodObject) => (req: e.Request, res: e.Response, next: e.NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (e) {
        res.status(400).send(e.errors);
    }
};