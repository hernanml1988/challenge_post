CREATE TABLE IF NOT EXISTS posts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  CONSTRAINT posts_name_valid CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  CONSTRAINT posts_description_valid CHECK (
    char_length(btrim(description)) BETWEEN 1 AND 2000
  )
);