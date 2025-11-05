// @ts-check

import { object } from "zod";
import { orderSchema } from "./order.schema";

export const placeOrderSchema = object({
    body: orderSchema
});
