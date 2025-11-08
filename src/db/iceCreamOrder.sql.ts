export const tableCreate = "CREATE TABLE ICECREAM_ORDER (\
        id INT PRIMARY KEY AUTO_INCREMENT,\
        customer_name VARCHAR(50) NOT NULL,\
        status ENUM('placed', 'in_preparation', 'in_delivery', 'delivered') NOT NULL,\
        products VARCHAR(1000) NOT NULL,\
        createdAt VARCHAR(50) NOT NULL,\
        updatedAt VARCHAR(50) NOT NULL);";

export const tableDrop = "DROP TABLE IF EXISTS ICECREAM_ORDER;"
