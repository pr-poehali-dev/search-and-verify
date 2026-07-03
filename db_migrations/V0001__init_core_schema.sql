-- Волонтёры
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    phone VARCHAR(30) NOT NULL,
    vk_link VARCHAR(255),
    city VARCHAR(120),
    email VARCHAR(255),
    messenger VARCHAR(100),
    occupation VARCHAR(255),
    organization VARCHAR(255),
    experience TEXT,
    chats TEXT,
    available_time VARCHAR(120),
    contact_time_pref VARCHAR(120),
    password_hash VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'на модерации',
    level VARCHAR(20) NOT NULL DEFAULT 'новичок',
    requests_count INTEGER NOT NULL DEFAULT 0,
    found_count INTEGER NOT NULL DEFAULT 0,
    scammers_detected_count INTEGER NOT NULL DEFAULT 0,
    notif_new_requests BOOLEAN NOT NULL DEFAULT TRUE,
    notif_request_checked BOOLEAN NOT NULL DEFAULT TRUE,
    notif_urgent BOOLEAN NOT NULL DEFAULT TRUE,
    notif_channel VARCHAR(20) DEFAULT 'telegram',
    theme VARCHAR(10) NOT NULL DEFAULT 'dark',
    on_vacation BOOLEAN NOT NULL DEFAULT FALSE,
    personal_notes TEXT,
    last_active_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    approved_at TIMESTAMP
);

-- Заявки на пробив контакта
CREATE TABLE probe_requests (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(30),
    profile_link VARCHAR(255),
    card_number VARCHAR(30),
    suspect_name VARCHAR(255),
    reasons TEXT[] NOT NULL DEFAULT '{}',
    other_reason TEXT,
    requester_contact VARCHAR(255) NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'новая',
    result VARCHAR(30),
    danger_level VARCHAR(20),
    urgent BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_volunteer_id INTEGER REFERENCES volunteers(id),
    admin_comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Заявки на поиск и сопровождение
CREATE TABLE search_requests (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(20) NOT NULL DEFAULT 'поиск',

    volunteer_full_name VARCHAR(255),
    volunteer_phone VARCHAR(30),
    volunteer_vk VARCHAR(255),
    volunteer_city VARCHAR(120),
    volunteer_org VARCHAR(255),

    requester_full_name VARCHAR(255) NOT NULL,
    requester_phone VARCHAR(30) NOT NULL,
    requester_vk VARCHAR(255),
    requester_relation VARCHAR(120),
    last_contact_date DATE,
    contacted_where TEXT,

    missing_who VARCHAR(120),
    missing_full_name VARCHAR(255),
    missing_birth_date DATE,
    missing_age INTEGER,
    callsign VARCHAR(120),
    token_number VARCHAR(60),
    military_unit VARCHAR(255),
    subdivision VARCHAR(255),
    position VARCHAR(255),
    place_lost VARCHAR(255),
    contact_date DATE,
    circumstances TEXT,
    appearance TEXT,
    photo_url VARCHAR(500),

    what_happened TEXT[] NOT NULL DEFAULT '{}',
    help_needed TEXT[] NOT NULL DEFAULT '{}',
    already_done TEXT[] NOT NULL DEFAULT '{}',
    already_done_other TEXT,
    consultation_type VARCHAR(20),

    consent_1 BOOLEAN NOT NULL DEFAULT FALSE,
    consent_2 BOOLEAN NOT NULL DEFAULT FALSE,
    consent_3 BOOLEAN NOT NULL DEFAULT FALSE,

    status VARCHAR(30) NOT NULL DEFAULT 'новая',
    result VARCHAR(30),
    found_date DATE,
    found_where TEXT,
    found_comment TEXT,

    assigned_volunteer_id INTEGER REFERENCES volunteers(id),
    admin_comment TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Стоп-лист мошенников
CREATE TABLE stop_list (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    link VARCHAR(255),
    card VARCHAR(30),
    scheme TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Мошенник',
    source_probe_request_id INTEGER REFERENCES probe_requests(id),
    added_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Отзывы
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    city VARCHAR(120),
    situation VARCHAR(255),
    review_text TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    consent_publish BOOLEAN NOT NULL DEFAULT FALSE,
    moderation_status VARCHAR(20) NOT NULL DEFAULT 'на модерации',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- История проверок контактов (для связи заявок между собой)
CREATE TABLE contact_checks (
    id SERIAL PRIMARY KEY,
    contact_value VARCHAR(255) NOT NULL,
    contact_type VARCHAR(30),
    probe_request_id INTEGER REFERENCES probe_requests(id),
    result VARCHAR(30),
    checked_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Теги заявок
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE probe_request_tags (
    probe_request_id INTEGER NOT NULL REFERENCES probe_requests(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id),
    PRIMARY KEY (probe_request_id, tag_id)
);

CREATE TABLE search_request_tags (
    search_request_id INTEGER NOT NULL REFERENCES search_requests(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id),
    PRIMARY KEY (search_request_id, tag_id)
);

-- Шаблоны комментариев админа
CREATE TABLE comment_templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Достижения волонтёров
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    code VARCHAR(60) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(60)
);

CREATE TABLE volunteer_achievements (
    volunteer_id INTEGER NOT NULL REFERENCES volunteers(id),
    achievement_id INTEGER NOT NULL REFERENCES achievements(id),
    earned_at TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY (volunteer_id, achievement_id)
);

-- Лог действий администратора
CREATE TABLE action_log (
    id SERIAL PRIMARY KEY,
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(60),
    entity_id INTEGER,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Настройки сайта (тексты, контакты, счётчики)
CREATE TABLE site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT
);

INSERT INTO site_settings (key, value) VALUES
    ('found_people_count', '47'),
    ('contact_phone', '89518125229'),
    ('contact_vk', 'vk.com/id1117400900');

INSERT INTO achievements (code, title, icon) VALUES
    ('first_request', 'Первая заявка', 'Star'),
    ('ten_requests', 'Десять заявок', 'Medal'),
    ('fifty_requests', 'Пятьдесят заявок', 'Trophy'),
    ('hundred_requests', 'Сто заявок', 'Crown'),
    ('scammer_detected', 'Выявил мошенника', 'ShieldAlert'),
    ('search_participant', 'Участвовал в поиске человека', 'Search'),
    ('person_found', 'Человек найден', 'UserRoundCheck');

CREATE INDEX idx_probe_requests_status ON probe_requests(status);
CREATE INDEX idx_probe_requests_phone ON probe_requests(phone);
CREATE INDEX idx_probe_requests_link ON probe_requests(profile_link);
CREATE INDEX idx_probe_requests_card ON probe_requests(card_number);
CREATE INDEX idx_search_requests_status ON search_requests(status);
CREATE INDEX idx_search_requests_missing_name ON search_requests(missing_full_name);
CREATE INDEX idx_stop_list_phone ON stop_list(phone);
CREATE INDEX idx_stop_list_link ON stop_list(link);
CREATE INDEX idx_stop_list_card ON stop_list(card);
CREATE INDEX idx_contact_checks_value ON contact_checks(contact_value);
CREATE INDEX idx_reviews_moderation ON reviews(moderation_status);
