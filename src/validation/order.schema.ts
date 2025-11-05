// @ts-check

import { object, string, array, union } from "zod";
import { productSchema, productOnlyIdSchema } from "./product.schema";

export const orderSchema = object({
    customer_name: string().nonoptional,
    products: array(
        union([productSchema, productOnlyIdSchema])
    )
})