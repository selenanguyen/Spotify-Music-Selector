-- Problem 2
DROP DATABASE IF EXISTS spotifyApp;
CREATE DATABASE spotifyApp;

USE spotifyApp;
CREATE TABLE artists
(
  artist_id                  		VARCHAR(50)				PRIMARY KEY		NOT NULL,
  artist_name                     	VARCHAR(50)		NOT NULL
);

CREATE TABLE albums
(
  album_id                  		VARCHAR(50)				PRIMARY KEY		NOT NULL,
  album_name                     	VARCHAR(100)		NOT NULL,
  artist							VARCHAR(50)				NOT NULL,
  CONSTRAINT albums_fk_artists
	FOREIGN KEY (artist) REFERENCES artists (artist_id)
    ON DELETE CASCADE
);

CREATE TABLE songs
(
  song_id                  		VARCHAR(50)     PRIMARY KEY,
  song_name						VARCHAR(50)		NOT NULL,
  album               			VARCHAR(50)				NOT NULL,
  acousticness					FLOAT			NOT NULL,
  danceability					float			NOT NULL,
  energy						FLOAT			NOT NULL,
  instrumentalness				float			NOT NULL,
  track_key						float			NOT NULL,
  liveness							float			NOT NULL,
  loudness						float			NOT NULL,
  modality							int			NOT NULL,
  speechiness						float			NOT NULL,
  tempo								float			NOT NULL,
  valence						float			NOT NULL,
  CONSTRAINT songs_fk_albums
	FOREIGN KEY (album) REFERENCES albums (album_id)
    ON DELETE CASCADE
);

CREATE TABLE users
(
  user_id                  		VARCHAR(50)             PRIMARY KEY,
  user_name               		VARCHAR(50)		NOT NULL
);

CREATE TABLE playlists
(
  playlist_id                  	varchar(50)          primary key,
  creator                     	VARCHAR(50)				NOT NULL,
  playlist_name               	VARCHAR(50)				NOT NULL,
  date_created					DATE					NOT NULL,
  playlist_description			VARCHAR(100),
  PRIMARY KEY(playlist_id, creator),
  CONSTRAINT playlists_fk_artists
    FOREIGN KEY (creator) REFERENCES users (user_id)
    ON DELETE CASCADE
);

CREATE TABLE playlist_songs
(
	song_id						VARCHAR(50)				NOT NULL,
    playlist_id					VARCHAR(50)				NOT NULL,
    PRIMARY KEY(song_id, playlist_id),
    CONSTRAINT playlist_songs_fk_songs
		FOREIGN KEY (song_id) REFERENCES songs (song_id)
        ON DELETE CASCADE,
	CONSTRAINT playlist_songs_fk_playlists
		FOREIGN KEY (playlist_id) REFERENCES playlists (playlist_id)
        ON DELETE CASCADE
); 

CREATE TABLE user_songs
(
	song_id						VARCHAR(50)				NOT NULL,
    user_id						VARCHAR(50)				NOT NULL,
    PRIMARY KEY(song_id, user_id),
    CONSTRAINT user_songs_song_fk_songs
		FOREIGN KEY	(song_id) REFERENCES songs (song_id)
        ON DELETE CASCADE,
	CONSTRAINT user_songs_user_fk_users
		FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
);
select * from songs;
select * from user_songs;
select * from artists;
select * from albums;

select * from users;
-- INSERT INTO users(user_id,user_name) 
-- VALUES("1252205107","selena nguyen");
-- INSERT INTO playlists(playlist_id,creator,playlist_name,date_created,playlist_description) 
-- VALUES("playlist 1","1252205107", "day 1",CURRENT_DATE(),"my day 1 playlist");
-- select * from playlists;

-- INSERT INTO playlists(playlist_id,creator,playlist_name,date_created,playlist_description)
-- VALUES("playlist1","1252205107","day 1",CURRENT_DATE(),"my day 1 playlist");
-- INSERT INTO playlists(playlist_id,creator,playlist_name,date_created,playlist_description)
-- VALUES("playlist2","1252205107","day 2",CURRENT_DATE(),"my day 2 playlist");
-- INSERT INTO playlist_songs(song_id,playlist_id)
-- VALUES("0725YWm6Z0TpZ6wrNk64Eb","playlist1");
-- INSERT INTO playlist_songs(song_id,playlist_id)
-- VALUES("07oiSjg6TiehyOS3pRJo0l","playlist1");
-- INSERT INTO playlist_songs(song_id,playlist_id)
-- VALUES("08xsXR637CEqbxJmpFcuSA","playlist2");
-- select * from playlist_songs;
-- select * from playlists;