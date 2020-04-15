-- Updated procedures for Spotify Music Selector
use spotifyApp;
DROP PROCEDURE IF EXISTS get_all_songs;
DROP PROCEDURE IF EXISTS get_playlists;
DROP PROCEDURE IF EXISTS get_playlist_songs;
DROP PROCEDURE IF EXISTS generate_playlist;
DROP PROCEDURE IF EXISTS add_playlist;

DELIMITER //
CREATE PROCEDURE get_all_songs(
	user_id VARCHAR(50)
)
BEGIN
	SELECT * 
    FROM users JOIN user_songs ON users.user_id = user_songs.user_id
		JOIN songs ON user_songs.song_id = songs.song_id
		JOIN albums ON songs.album = albums.album_id
		JOIN artists ON albums.artist = artists.artist_id
    WHERE users.user_id = user_id;
END //

CREATE PROCEDURE get_playlists(
	user_id VARCHAR(50)
)
BEGIN
	SELECT * 
    FROM users JOIN playlists ON playlists.creator = users.user_id
    WHERE users.user_id = user_id;
END //

CREATE PROCEDURE get_playlist_songs(
	playlist_id VARCHAR(50)
)
BEGIN
	SELECT * 
    FROM playlists JOIN playlist_songs ON playlists.playlist_id = playlist_songs.playlist_id
    JOIN songs ON playlist_songs.song_id = songs.song_id
    JOIN albums ON albums.album_id = songs.album
    JOIN artists ON albums.artist = artists.artist_id
    WHERE playlists.playlist_id = playlist_id;
END //

CREATE PROCEDURE add_playlist(
	 user_id VARCHAR(50),
     p_id VARCHAR(50),
     p_name VARCHAR(50),
     p_description VARCHAR(250)
)
BEGIN
	insert into playlists (playlist_id, creator,playlist_name,date_created,playlist_description)
    VALUES(p_id, user_id, p_name, CURRENT_DATE(), p_description);
END //

CREATE PROCEDURE generate_playlist(
	 userInp VARCHAR(50),
     newPID VARCHAR(50),
     numSongs int,
     acousticScore float,
     acousticnessWeight float,
     danceabilityScore float,
     danceabilityWeight float,
     energyScore float,
     energyWeight float,
	 instrumentalScore float,
     instrumentalnessWeight float,
     loudnessScore float,
     loudnessWeight float,
     valenceScore float,
     valenceWeight float,
     tempoScore float,
     tempoWeight float
)
BEGIN
	insert into playlist_songs (playlist_songs.song_id, playlist_songs.playlist_id)
    select Songs.songlist, newPID  from 
    (SELECT user_songs.song_id as songList,
	(Abs(songs.acousticness * 10 - acousticScore) * acousticnessWeight +
    Abs(songs.danceability * 10 - danceabilityScore) * danceabilityWeight +
    Abs(songs.energy * 10 - energyScore) * energyWeight +
    Abs(songs.instrumentalness * 10 - instrumentalScore) * instrumentalnessWeight +
	Abs(songs.valence * 10 - valenceScore) * valenceWeight +
    Abs(((songs.loudness + 30) /3) - loudnessScore) * loudnessWeight +
    Abs(((songs.tempo - 50) * 2 /30) - loudnessScore) * loudnessWeight
    ) as Score
    FROM user_songs
    JOIN songs ON user_songs.song_id = songs.song_id
    WHERE user_songs.user_id = userInp 
    order by Score ASC
    limit numSongs) as Songs;
END //


-- CREATE PROCEDURE get_saved_songs(
-- 	user_id VARCHAR(50)
-- )
-- BEGIN
-- 	SELECT * 
--     FROM users JOIN user_songs ON users.user_id = user_songs.user_id
-- 		JOIN songs ON user_songs.song_id = songs.song_id
-- 		JOIN albums ON songs.album = albums.album_id
-- 		JOIN artists ON albums.artist = artists.artist_id
--     WHERE users.user_id = user_id;
-- END //

-- TODO: get saved songs and get playlist songs from user id

select * from playlists;
