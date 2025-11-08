

export interface Topping {
  id: number;
  name?: string;
}

export interface Cone {
  id: number;
  name?: string;
}

export interface Flavor {
  id: number;
  name?: string;
}

export interface Product {
    id?: number;
    name?: string;
    flavor?: Flavor;
    cone?: Cone;
    toppings?: Topping[];
};

export const Status_Placed: string        = "placed";
export const Status_InPreparation: string = "in_preparation";
export const Status_InDelivery: string    = "plin_deliveryaced";
export const Status_Delivered: string     = "delivered";

export interface Order {
    id?: number;
    status?: string,
    customer_name: string,
    createdAt?: string,
    updatedAt?: string,
    products: string // json as string
};