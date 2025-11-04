
CREATE TABLE IF NOT EXISTS migration (
    `id` INTEGER PRIMARY KEY,
    `name` TEXT UNIQUE NOT NULL,
    `created_at` DATETIME DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%S', 'NOW', 'localtime'))
);