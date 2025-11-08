// @ts-check

import * as z from "zod";

export const orderModelSchema = z.object({
    id: z.number(),
    status: z.enum(['placed', 'in_preparation', 'in_delivery', 'delivered']),
    customer_name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    products: z.string()
});
