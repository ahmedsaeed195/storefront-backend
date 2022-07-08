CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password_digest VARCHAR(60) NOT NULL
);
CREATE UNIQUE INDEX username ON users(username);