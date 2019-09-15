DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);
USE bamazon;
SELECT * FROM products;



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone X", "phones", 1000, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mac Book Pro", "computers", 1500, 350),
 ("Lenovo SCE", "computers", 900, 435),
("Samsung 8s", "phones", 800, 200),
("Android XE", "phones", 500, 150),
("Samsung Sound", "speakers", 300, 100),
("Lenovo ThinkPad", "computers", 850, 250),
("Sony Surrond", "speakers", 175, 350),
("iPhone 11", "phones", 1100, 380),
("Samsung 10s", "phones", 900, 900);
