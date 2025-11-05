// @ts-check

import { Sequelize } from "sequelize";

// Jest doesn't support mocking ES6 modules, so we are using global variable for the connection

globalThis.__DB_CONNECTION__ = new Sequelize(
    process.env['mysql_database'],
    process.env['mysql_user'],
    process.env['mysql_password'], {
        host: process.env['mysql_host'],
        port: +process.env['mysql_port'],
        dialect: 'mysql'
    }
);   
