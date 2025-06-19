-- Database schema and seed data for App Health Dashboard

-- Drop tables if they exist (for idempotency in dev)
DROP TABLE IF EXISTS health_checks CASCADE;
DROP TABLE IF EXISTS application_tag CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS tags CASCADE;

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Applications table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    url VARCHAR(255) NOT NULL,
    is_production BOOLEAN DEFAULT FALSE
);

-- Association table for many-to-many Application <-> Tag
CREATE TABLE application_tag (
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (application_id, tag_id)
);

-- Health checks table
CREATE TABLE health_checks (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(16) NOT NULL,
    response_time FLOAT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed tags
INSERT INTO tags (name) VALUES ('aws'), ('azure');

-- Seed applications
INSERT INTO applications (name, url, is_production) VALUES
  ('AWS Console', 'https://console.aws.amazon.com', TRUE),
  ('Azure Portal', 'https://portal.azure.com', TRUE);

-- Associate applications with tags
INSERT INTO application_tag (application_id, tag_id)
SELECT a.id, t.id FROM applications a, tags t WHERE a.name = 'AWS Console' AND t.name = 'aws';
INSERT INTO application_tag (application_id, tag_id)
SELECT a.id, t.id FROM applications a, tags t WHERE a.name = 'Azure Portal' AND t.name = 'azure'; 