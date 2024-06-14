-- Tạo bảng users
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    name_display VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng tag
CREATE TABLE tags (
    id BIGINT PRIMARY KEY,
    tag_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng topics
CREATE TABLE topics (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    author_id BIGINT REFERENCES users(id),
    description TEXT,
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng blogs
CREATE TABLE blogs (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    body TEXT,
    view BIGINT,
    author_id BIGINT REFERENCES users(id),
    topic_id BIGINT REFERENCES topics(id),
    privacy INT,
    status INT,
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng blog_tag
CREATE TABLE blog_tag (
    id_blog BIGINT REFERENCES blogs(id),
    id_tag BIGINT REFERENCES tags(id),
    created_at DATE,
    updated_at DATE,
    PRIMARY KEY (id_blog, id_tag)
);

-- Tạo bảng comments
CREATE TABLE comments (
    id BIGINT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    up_vote INT,
    down_vote INT,
    author_id BIGINT REFERENCES users(id),
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng question
CREATE TABLE questions (
    id BIGINT PRIMARY KEY,
    question VARCHAR(255) UNIQUE NOT NULL,
    up_vote INT,
    down_vote INT,
    author_id BIGINT REFERENCES users(id),
    images VARCHAR,
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng answers
CREATE TABLE answers (
    id BIGINT PRIMARY KEY,
    answer VARCHAR(255) NOT NULL,
    up_vote INT,
    down_vote INT,
    author_id BIGINT REFERENCES users(id),
    images VARCHAR,
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng report
CREATE TABLE reports (
    id BIGINT PRIMARY KEY,
    type INT,
    author_id BIGINT REFERENCES users(id),
    content TEXT,
    entity_id BIGINT,
    type_entity INT,
    created_at DATE,
    updated_at DATE
);

-- Tạo bảng question_tag
CREATE TABLE question_tag (
    id_question BIGINT REFERENCES questions(id),
    id_tag BIGINT REFERENCES tags(id),
    created_at DATE,
    updated_at DATE,
    PRIMARY KEY (id_question, id_tag)
);
