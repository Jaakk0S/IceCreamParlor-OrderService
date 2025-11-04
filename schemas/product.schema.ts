// @ts-check

import { object, number, array } from "zod";

export const productSchema = object({
    flavor: object({
        id: number(),
    }).nonoptional,
    cone: object({
        id: number()
    }).nonoptional,
    toppings : array(
        object({
            id: number()
        })
    ).optional
});

export const productOnlyIdSchema = object({
    id: number().nonoptional
});
