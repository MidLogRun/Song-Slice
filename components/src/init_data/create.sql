DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
  password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS release CASCADE;
CREATE TABLE release(
    release_id INT PRIMARY KEY,
    title varchar(100) NOT NULL,
    artist varchar(100) NOT NULL,
    release_year INT NOT NULL,
    totalTracks INT NOT NULL,
    overallRating DECIMAL(3,2) -- i think we change this to rating. overall rating will be calculated with a simple average of all ratings in this collum
);

DROP TABLE IF EXISTS song CASCADE;
CREATE TABLE song(
    song_id INT PRIMARY KEY,
    release_id INT,
    songTitle VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    duration_seconds INT NOT NULL,
    CONSTRAINT FK_song_release FOREIGN KEY (release_id) REFERENCES release(release_id)
);


DROP TABLE IF EXISTS review CASCADE;
CREATE TABLE review(
    review_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    release_id INT,
    title VARCHAR(50) NOT NULL,
    summary TEXT,
    rating INT CHECK (rating >= 1 and rating <= 5) NOT NULL,
    CONSTRAINT FK_review_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT FK_review_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT UQ_user_release_review UNIQUE (username, release_id) -- Ensures that each user can only make one review per release
);

DROP TABLE IF EXISTS userLibrary CASCADE;
CREATE TABLE userLibrary(
    username VARCHAR(50) NOT NULL,
    release_id INT,
    CONSTRAINT FK_userLibrary_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT FK_userLibrary_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT PK_userLibrary PRIMARY KEY (username, release_id)
);

DROP TABLE IF EXISTS user_to_release CASCADE;
CREATE TABLE user_to_release(
    user_id INT,
    release_id INT; --may need to change to album or something
    rating INT;
    --FK's and references, etc;
);

