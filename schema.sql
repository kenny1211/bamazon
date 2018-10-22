DROP DATABASE IF EXISTS products_db;
CREATE DATABASE products_db;

USE products_db;

CREATE TABLE products(
  id INT AUTO_INCREMENT NOT NULL,
  product VARCHAR(100) NOT NULL,
  department VARCHAR (50) NOT NULL,
  price INT NOT_NULL,
  stock INT NOT NULL,
  PRIMARY KEY (id)
);