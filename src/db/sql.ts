export const create = "CREATE TABLE ICECREAM_ORDER (\
        ID INT PRIMARY KEY AUTO_INCREMENT,\
        STATUS ENUM('placed', 'in_preparation', 'in_delivery', 'delivered') NOT NULL,\
        CUSTOMER_NAME VARCHAR(50) NOT NULL,\
        PRODUCTS JSON NOT NULL,\
        createdAt TIMESTAMP NOT NULL,\
        updatedAt TIMESTAMP NOT NULL);";

export const drop = "DROP TABLE ICECREAM_ORDER;"