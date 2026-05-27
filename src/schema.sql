CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    source TEXT,
    src_ip TEXT,
    dst_ip TEXT,
    user TEXT,
    event_type TEXT,
    severity TEXT,
    raw TEXT,
    tags TEXT,
    flagged INTEGER,
    metadata TEXT
)