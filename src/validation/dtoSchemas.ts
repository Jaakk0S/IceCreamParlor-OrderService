// @ts-check

import * as z from "zod";

export const coneDTOSchema = z.object({
    id: z.number(),
    name: z.string().optional()
});

export const flavorDTOSchema = z.object({
    id: z.number(),
    name: z.string().optional()
});

export const toppingDTOSchema = z.object({
    id: z.number(),
    name: z.string().optional()
});

export const customProductDTOSchema = z.object({
    flavor: flavorDTOSchema,
    cone: coneDTOSchema,
    toppings: z.array(toppingDTOSchema).optional()
});

export const existingProductDTOSchema = z.object({
    id: z.number(),
    name: z.string().optional(),
    flavor: flavorDTOSchema.optional(),
    cone: coneDTOSchema.optional(),
    toppings: z.array(toppingDTOSchema).optional()
});

export const orderDTOSchema = z.object({
    id: z.number().optional(),
    status: z.enum(['placed', 'in_preparation', 'in_delivery', 'delivered']).optional(),
    customer_name: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    products: z.array(z.union([existingProductDTOSchema, customProductDTOSchema]))
});

export const placeOrderSchema = z.object({
    body: orderDTOSchema
});
