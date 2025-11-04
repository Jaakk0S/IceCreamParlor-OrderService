// @ts-check

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env['mysql_test_database'], process.env['mysql_test_user'], process.env['mysql_test_password'], {
  host: process.env['mysql_test_host'],
  port: process.env['mysql_test_port'],
  dialect: 'mysql'
});

module.exports = sequelize;