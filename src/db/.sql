CREATE TABLE movies(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    producer VARCHAR,
    actors VARCHAR,
    country VARCHAR,
    poster VARCHAR,
    duration INT,
    slug VARCHAR,
    rating INT,
    trailer VARCHAR
);

CREATE TABLE genres(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE movies_genres(
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY(movie_id) REFERENCES movies(id),
    FOREIGN KEY(genre_id) REFERENCES genres(id)
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    login VARCHAR(255),
    password VARCHAR(255),
    isActivated BOOLEAN DEFAULT FALSE
);


CREATE TABLE tokens(
    id SERIAL PRIMARY KEY,
    refreshToken VARCHAR,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE sessions(
    id SERIAL PRIMARY KEY,
    hall_number INT NOT NULL,
    movie_id INT NOT NULL,
    date TIMESTAMP NOT NULL,
    FOREIGN KEY(movie_id) REFERENCES movies (id)
);


CREATE TABLE booking(
    id SERIAL PRIMARY KEY,
    price INT,
    email VARCHAR(255),
    unique_code INT NOT NULL,
    session_id INT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES sessions (id)
);

CREATE TABLE seats(
    id SERIAL PRIMARY KEY,
    hall_number INT NOT NULL,
    row_number INT NOT NULL, 
    seat_number INT NOT NULL,
    price INT NOT NULL,
    session_id INT NOT NULL,
    booking_id INT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY(booking_id) REFERENCES booking (id),
    FOREIGN KEY(session_id) REFERENCES sessions (id)
);

CREATE TABLE booking_seats(

)



CREATE TABLE tests(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);




SELECT id, hall_number, DATE(date)::TIMESTAMP as date FROM sessions WHERE DATE(date) = DATE '1992-02-21' and hall_number = 1;