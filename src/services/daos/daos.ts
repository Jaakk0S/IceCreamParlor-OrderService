import { Order } from "../../db/models";

export interface MenuDAO {
  id?: number;
}

export interface ToppingDAO extends MenuDAO {
  name?: string;
}

export interface ConeDAO extends MenuDAO {
  name?: string;
}

export interface FlavorDAO extends MenuDAO {
  name?: string;
}

export interface ProductDAO extends MenuDAO {
    name?: string;
    flavor?: FlavorDAO;
    cone?: ConeDAO;
    toppings?: ToppingDAO[];
};

export interface OrderDAO extends MenuDAO {
    status?: string,
    customer_name: string,
    createdAt?: string,
    updatedAt?: string,
    products: ProductDAO[]
};

export function toModel(orderDAO: OrderDAO): Order {
    return {
        id: orderDAO.id,
        status: orderDAO.status,
        customer_name: orderDAO.customer_name,
        createdAt: orderDAO.createdAt,
        updatedAt: orderDAO.updatedAt,
        products: JSON.stringify(orderDAO.products)
    }
}

export function toDAO(orderModel: Order): OrderDAO {
    return {
        id: orderModel.id,
        status: orderModel.status,
        customer_name: orderModel.customer_name,
        createdAt: orderModel.createdAt,
        updatedAt: orderModel.updatedAt,
        products: JSON.parse(orderModel.products)
    }
}