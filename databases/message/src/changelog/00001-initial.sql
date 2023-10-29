CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL DEFAULT unique_rowid(),
    tag STRING(20) UNIQUE,
    display_name STRING
);

CREATE TABLE chat (
    id INT PRIMARY KEY NOT NULL DEFAULT unique_rowid(),
    user_a INT NOT NULL REFERENCES users (id),
    user_b INT NOT NULL REFERENCES users (id)
);

CREATE TABLE messages (
    id INT PRIMARY KEY NOT NULL DEFAULT unique_rowid(),
    content STRING NOT NULL,
    chat INT NOT NULL REFERENCES chat (id),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
