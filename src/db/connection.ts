// @ts-check

import knex from "knex";

let _connection: knex.Knex;

export const getDbConnection = (): knex.Knex => {
  if (!_connection) {
    _connection = knex({
      client: 'mysql2',
      connection: {
        host: process.env.mysql_host,
        port: +process.env.mysql_port,
        user: process.env.mysql_user,
        password: process.env.mysql_password,
        database: process.env.mysql_database,
      },
      acquireConnectionTimeout: 1000000,
      pool: {
        min: 0,
        max: 4,
        acquireTimeoutMillis: 300000,
        createTimeoutMillis: 300000,
        destroyTimeoutMillis: 300000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 2000
      }
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

