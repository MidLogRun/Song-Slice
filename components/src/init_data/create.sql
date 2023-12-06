DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
  password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS release CASCADE;
CREATE TABLE release(
    release_id varchar(25) PRIMARY KEY,
    overallRating DECIMAL(3,2)  CHECK (overallRating >= 0 AND overallRating <= 5)
);

DROP TABLE IF EXISTS song CASCADE;
CREATE TABLE song(
    song_id INT PRIMARY KEY,
    release_id varchar(25),
    songTitle VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    duration_seconds INT NOT NULL,
    CONSTRAINT FK_song_release FOREIGN KEY (release_id) REFERENCES release(release_id)
);


DROP TABLE IF EXISTS review CASCADE;
CREATE TABLE review(
    username VARCHAR(50) NOT NULL,
    release_id varchar(25),
    summary text,
    CONSTRAINT FK_review_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT FK_review_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT UQ_user_release_review UNIQUE (username, release_id) -- Ensures that each user can only make one review per release
);

DROP TABLE IF EXISTS userLibrary CASCADE;
CREATE TABLE userLibrary(
    username VARCHAR(50) NOT NULL,
    release_id varchar(25),
    CONSTRAINT FK_userLibrary_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT FK_userLibrary_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT PK_userLibrary PRIMARY KEY (username, release_id)
);

DROP TABLE IF EXISTS user_to_release CASCADE;
CREATE TABLE user_to_release(
    username VARCHAR(50),
    release_id VARCHAR(25), --may need to change to album or something
    rating DECIMAL(3,2),
    CONSTRAINT FK_user_to_release_user FOREIGN KEY (username) REFERENCES users(username),
    CONSTRAINT FK_user_to_release_release FOREIGN KEY (release_id) REFERENCES release(release_id),
    CONSTRAINT PK_user_to_release PRIMARY KEY (username, release_id)
    --FK's and references, etc;
);

