export const tableCreate = "CREATE TABLE ICECREAM_ORDER (\
  id INT UNSIGNED auto_increment,\
  customer_name VARCHAR(50) NOT NULL,\
  status ENUM('placed','in_preparation', 'prepared', 'in_delivery','delivered') NOT NULL,\
  products VARCHAR(10000) NOT NULL,\
  createdAt VARCHAR(50) NOT NULL,\
  updatedAt VARCHAR(50) NOT NULL,\
  PRIMARY KEY (id)\
) auto_increment = 1;"

export const tableDrop = "DROP TABLE IF EXISTS ICECREAM_ORDER;"

export const resetAutoIncrement = "ALTER TABLE ICECREAM_ORDER AUTO_INCREMENT = 1;";
