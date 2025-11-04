// @ts-check

import { object, number, string, array, union } from "zod";
import { productSchema, productOnlyIdSchema } from "./product.schema";

export const createOrderSchema = object({
    body: object({
        customer_name: string().nonoptional,
        products: array(
            union([productSchema, productOnlyIdSchema])
        )
    })
});
