// @ts-check

import { DataTypes } from "sequelize";

export const Order = (sequelize) => {
    return sequelize.define('ICECREAM_ORDER', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM('placed', 'in_preparation', 'in_delivery', 'delivered'),
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        products: {
            type: DataTypes.JSON,
            allowNull: false
        } 
    }, {
        freezeTableName: true
    });
};
