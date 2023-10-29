ALTER TABLE messages ADD COLUMN from_user INT NOT NULL REFERENCES users (id),
