ALTER TABLE messages ADD COLUMN from_user INT NOT NULL;
ALTER TABLE messages ADD CONSTRAINT fk_from_user FOREIGN KEY (from_user) REFERENCES users (id);
