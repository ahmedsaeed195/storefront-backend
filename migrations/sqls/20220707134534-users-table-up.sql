CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password_digest VARCHAR(60)
);
CREATE UNIQUE INDEX username ON users(username);