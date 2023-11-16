DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  email VARCHAR(50)
);

DROP TABLE IF EXISTS release CASCADE;
CREATE TABLE release(
    release_id INT PRIMARY KEY,
    title varchar(50),
    artist varchar(50),
    release_year INT,
    totalTracks INT,
    overallRating DECIMAL CHECK (overallRating >= 1 and overallRating <=5)
);

DROP TABLE IF EXISTS song CASCADE;
CREATE TABLE song(
    song_id INT PRIMARY KEY,
    songTitle VARCHAR(100),
    duration_minutes INT,
    duration_seconds INT
);

DROP TABLE IF EXISTS song_to_release CASCADE;
CREATE TABLE song_to_release(
    song_id INT,
    release_id INT
);

DROP TABLE IF EXISTS rateReview CASCADE;
CREATE TABLE rateReview(
    review_id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    release_id INT,
    title VARCHAR(50),
    summary VARCHAR(300),
    rating INT NOT NULL CHECK (rating >= 1 and rating <= 5)
);

DROP TABLE IF EXISTS review_to_release CASCADE;
CREATE TABLE review_to_release(
    review_id INT,
    release_id INT
);

DROP TABLE IF EXISTS review_to_user CASCADE;
CREATE TABLE review_to_user(
    review_id INT,
    username VARCHAR(50) UNIQUE NOT NULL,
    isReviewed BIT(1)
);