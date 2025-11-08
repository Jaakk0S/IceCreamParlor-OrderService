// @ts-check

/*
    Menu service uses a REST client to communicate with the Menu API
*/

import { rejects } from "assert";
import log from "../utils/logger";
import { ConeDAO, FlavorDAO, MenuDAO, ProductDAO, ToppingDAO } from "./daos/daos";

export async function menuApiGet(path: string, id: number): Promise<MenuDAO> {
    const { menuservice_host, menuservice_port} = process.env;
    const url = `http://${menuservice_host}:${menuservice_port}/${path}/${id}`;
    log.info(`Fetching ${url}`);

    return new Promise(async function(resolve, reject) {
        await fetch(url).then(response => {
            log.info('Response status: ' + response.status);
            response.json().then(val => {
                resolve(val);
            });
        }).catch(err => {
            log.error('Fetch failed: ' + err);
            reject(err);
        });
    });
}

export async function getToppings(ids: number[]): Promise<ToppingDAO[]> {
    const toppings:Promise<ToppingDAO>[] = ids.map(id => menuApiGet("admin/v1/topping", id));
    return new Promise(async function(resolve, reject) {
        Promise.all(toppings).then((values) => {
            resolve(values);
        }).catch(e => {
            log.error(e);
            reject(e);
        });
    });
}

export async function getProduct(product: ProductDAO): Promise<ProductDAO> {

    // If the product object has an id, then fetch a product based on that id
    
    if (product.id) {
        return menuApiGet("admin/v1/product", product.id);
    }

    // Otherwise, fetch and populate each product component separately, based on their ids

    if (!product.toppings)
        product.toppings = [];

    return new Promise(async function(resolve, reject) {
        const flavor:Promise<FlavorDAO> = menuApiGet("admin/v1/flavor", product.flavor.id);
        const cone:Promise<ConeDAO> = menuApiGet("admin/v1/cone", product.cone.id);
        const toppings:Promise<ToppingDAO[]> = getToppings(product.toppings.map((t: ToppingDAO) => t.id));
        Promise.all([flavor, cone, toppings]).then(values => {
            product.flavor = values[0];
            product.cone = values[1];
            product.toppings = values[2];
            resolve(product);
        }).catch(e => {
            log.error(e);
            reject(e);
        });
    });

}
