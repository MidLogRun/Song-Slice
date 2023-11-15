CREATE TABLE user(
    user_id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
);

CREATE TABLE release(
    release_id INT PRIMARY KEY,
    title varchar(100) NOT NULL,
    artist varchar(100) NOT NULL,
    release_year INT NOT NULL,
    totalTracks INT NOT NULL,
    overallRating DECIMAL(3,2) -- Assuming ratings are on a scale of 0.00 to 5.00
);

CREATE TABLE song(
    song_id INT PRIMARY KEY,
    release_id INT,
    songTitle VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    duration_seconds INT NOT NULL,
    CONSTRAINT FK_song_release FOREIGN KEY (release_id) REFERENCES release(release_id)
);

CREATE TABLE review(
    review_id INT PRIMARY KEY,
    user_id INT,
    release_id INT,
    title VARCHAR(50) NOT NULL,
    summary TEXT,
    rating INT CHECK (rating >= 1 and rating <= 5) NOT NULL,
    CONSTRAINT FK_review_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_review_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT UQ_user_release_review UNIQUE (user_id, release_id) -- Ensures that each user can only make one review per release
);

CREATE TABLE userLibrary(
    user_id INT,
    release_id INT,
    CONSTRAINT FK_userLibrary_user FOREIGN KEY (user_id) REFERENCES user(user_id),
    CONSTRAINT FK_userLibrary_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT PK_userLibrary PRIMARY KEY (user_id, release_id)
);