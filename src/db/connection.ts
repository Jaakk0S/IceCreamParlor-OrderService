// @ts-check

import knex, { Knex } from "knex";

let _connection:Knex;

export const getDbConnection = ():Knex => {
  if (!_connection) {

    if (process.env.orderservice_spinup_test_container == "true" && process.env.NODE_ENV == "test" && !globalThis.TestContainer)
      throw new Error("Test environment needs to have a test container running before creating Knex");

    _connection = knex({
      client: 'mysql2',
      connection: {
          host: process.env.mysql_host,
          port: +process.env.mysql_port,
          user: process.env.mysql_user,
          password: process.env.mysql_password,
          database: process.env.mysql_database,
      },
      //debug: true
    });
  }
  return _connection;
}

export const killDbConnection = () => {
  if (_connection) {
      _connection.destroy();
      _connection = null;
  }
};

