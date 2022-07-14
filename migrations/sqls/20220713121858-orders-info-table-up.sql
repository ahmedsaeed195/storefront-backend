CREATE TABLE orders_info(
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX order_id ON orders_info(order_id);
CREATE INDEX product_id ON orders_info(product_id);
CREATE VIEW orders_info_view AS
SELECT order_id,
    product_id,
    product_quantity
FROM orders_info;