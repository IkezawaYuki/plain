
-- +migrate Up
INSERT INTO users (email, name) 
VALUES 
  ('alice@example.com', 'Alice'),
  ('bob@example.com', 'Bob'),
  ('charlie@example.com', 'Charlie');

-- +migrate Down
DELETE FROM users where 1;