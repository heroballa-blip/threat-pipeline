Create table events (
    id integer primary key autoincrement,
    timestamp text,
    source text,
    src_ip text,
    user text,
    event_type text,
    raw text,
    tags text,
    flagged integer
)
