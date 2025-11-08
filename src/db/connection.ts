// @ts-check

import knex, { Knex } from "knex";

let _connection:Knex;

export const getDbConnection = ():Knex => {
  if (!_connection) {
    _connection = knex({
      client: 'mysql2',
      connection: {
          host: process.env.mysql_host,
          port: +process.env.mysql_port,
          user: process.env.mysql_user,
          password: process.env.mysql_password,
          database: process.env.mysql_database,
      }
    });
  }
  return _connection;
}
