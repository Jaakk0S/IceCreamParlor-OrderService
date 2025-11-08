import { testOrder } from "./generateTestData";
import { Order } from "../../src/db/models";
import { getDbConnection } from "../../src/db/connection";
import { tableCreate, tableDrop } from "../../src/db/iceCreamOrder.sql";

let initialOrder = testOrder();
delete initialOrder.id;

export const initializeTestData = async () => {
    try {
        await getDbConnection().raw(tableDrop).then(r => {
            console.log("Test tables dropped");
        });
        await getDbConnection().raw(tableCreate).then(r => {
            console.log("Test tables created");
        });
        await getDbConnection()<Order>('ICECREAM_ORDER').insert(initialOrder).then(r2 => {
            console.log("Test data inserted");
        });
    } catch (e) {
        console.error(e);
    }
};
