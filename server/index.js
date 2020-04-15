const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');//2/promise');
const SpotifyWebApi = require('spotify-web-api-node');
const moment = require("moment");
const _ = require("lodash");

const pino = require('express-pino-logger')();


var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cookieParser());
app.use(cors());

var client_id = 'eea02be1f6f34fed9b59426d482c6aee'; // Your client id
var client_secret = '67c0786a03d14feba40f746ad8d846c3'; // Your secret
var redirect_uri = 'http://localhost:3001/callback'; // Your redirect uri

/**
 * *******************************************************
 * ******************* SQL CONNECTION ********************
 * *******************************************************
 */
var connection;
var userSpotifyId;
var access_token;
var refresh_token;

var spotifyApi = new SpotifyWebApi();

// Error numbers we can ignore and skip adding to the database
const duplicateEntryErrNo = 1062;
const entryNameTooLongErrNo = 1406;
const quotationErrNo = 1064;
const invalidPasswordErrNo = 1045;

/**
 * *******************************************************
 * ********** Helper calls to the database ***************
 * *******************************************************
 */

/**
 * Gets all songs belonging to the current user
 */
 const getRandomSongs = async () => {
  let sql = `SELECT * from user_songs JOIN songs ON user_songs.song_id = songs.song_id
  WHERE user_songs.user_id = '${userSpotifyId}' ORDER BY RAND() LIMIT 3`;
  return connection.promise().query(sql).then(([rows, fields]) => {
    return rows
 })
 .then(rows => {
   spotifyApi.setAccessToken(access_token);
   let findTrack = (id, spotifyTracks) => {
     return spotifyTracks.find((spotifyTrack) => id === spotifyTrack.id);
   }
   let ids = rows.map(track => track.song_id);
   return spotifyApi.getTracks(ids).then(tracks => {
     let tracksAreValid = true;
     tracks.body.tracks.forEach(spTrack => {
       if (!spTrack.preview_url) {
         tracksAreValid = false;
       }
     });
     if (!tracksAreValid) {
       return getRandomSongs();
     }
     track = tracks.body.tracks;
     let newTracks = rows.map((dbTrack) => {
       return {
         ...dbTrack,
         ...findTrack(dbTrack.song_id, tracks.body.tracks)
       }
     });
     return newTracks;
 })
}).catch(e => {
  console.log(e)
})
}

/**
 * Calls procedure get_all_songs in database
 */
const getUserSongsFromDatabase = () => {
  let sql = `CALL get_all_songs(${userSpotifyId})`;
  return connection.promise().query(sql);
}

/**
 * Removes the playlist with the given ID from the database
 * @param {*} id 
 */
const removePlaylist = (id) => {
  let sql = `DELETE FROM playlists WHERE playlist_id = '${id}';`
  return connection.promise().query(sql).then((response) => true)
  .catch((e) => {
    console.log("ERROR REMOVING PLAYLIST " + id + ":", e);
  })
}

/**
 * Calls get_playlists procedure for the current user
 */
const getPlaylists = () => {
  let sql = `CALL get_playlists(${userSpotifyId})`
  return connection.promise().query(sql).then((response) =>{
    return response;
  }).catch((e) => {
    console.log("ERROR:", e);
  });
}

/**
 * Receives the playlist tracks for the given playlist id
 */
const getPlaylistTracks = (playlistId) => {
  let sql = `CALL get_playlist_songs('${playlistId}')`
  return connection.promise().query(sql).then((response) =>{
    return response;
  }).catch((e) => {
    console.log("ERROR:", e);
  });
}

/**
 * Updates the given playlist field with the given value
 * @param {*} id 
 * @param {*} field 
 * @param {*} value 
 */
const updatePlaylistField = async (id, field, value) => {
  let sql = `UPDATE playlists
    SET ${field} = '${value}' WHERE playlist_id = '${id}';`
  return connection.promise().query(sql).then((resp) => {
    return true;
  }).catch(e => {
    console.log(e)
    return false;
  });
}

/**
 * Adds the user to the database
 * @param {*} id  user id
 * @param {*} name user name
 */
const addUser = (id, name) => {
  let sql = `INSERT INTO users(user_id,user_name) VALUES("${id}","${name}")`;
  connection.query(sql, function (error, results, fields) {
    if (error && error.errno != duplicateEntryErrNo) {
      console.log(error);
    }
  })
}

/**
 * Adds the song, artist, album and their user-relationships to the database
 * @param {*} song 
 * @param {*} artist 
 * @param {*} album 
 * @param {*} userId 
 */
const addToDatabase = (song, artist, album, userId) => {
  let addArtistSql = `INSERT INTO artists(artist_id,artist_name) VALUES("${artist.id}",
    "${artist.name}")`;
  let addAlbumSql = `INSERT INTO albums(album_id,album_name,artist) VALUES("${album.id}",
  "${album.name}","${artist.id}")`;
  const { id, songName, acousticness, danceability, energy, instrumentalness, key, liveness, loudness, mode, 
    speechiness, tempo, valence } = song;
  let addSongSql = `INSERT INTO songs(song_id,song_name,album,acousticness,danceability,energy,instrumentalness,
    track_key,liveness,loudness,modality,speechiness,tempo,valence) VALUES("${id}",
    "${songName}","${album.id}",${acousticness},${danceability},${energy},${instrumentalness},${key},${liveness},
    ${loudness},${mode},${speechiness},${tempo},${valence})`;
  let addUserSongSql = `INSERT INTO user_songs(song_id,user_id) VALUES("${id}","${userId}")`;
  connection.query(addArtistSql, function (error, results, fields) {
    if (error && error.errno != duplicateEntryErrNo && error.errno != entryNameTooLongErrNo && error.errno != quotationErrNo) {
          // Do nothing. We can ignore these errors with our current implementation
          //console.log(error);
    }
    else {
      connection.query(addAlbumSql, function (error, results, fields) {
        if (error && error.errno != duplicateEntryErrNo && error.errno != entryNameTooLongErrNo && error.errno != quotationErrNo) {
          // Do nothing. We can ignore these errors with our current implementation
        }
        else {
          connection.query(addSongSql, function (error, results, fields) {
            if (error && error.errno != duplicateEntryErrNo && error.errno != entryNameTooLongErrNo 
              && error.errno != quotationErrNo && id != undefined) {
          // Do nothing. We can ignore these errors with our current implementation
        }
            else {
              connection.query(addUserSongSql, function (error, results, fields) {
                if (error && error.errno != duplicateEntryErrNo && id != undefined) {
          // Do nothing. We can ignore these errors with our current implementation
                }
              })
            }
          });
        }
      });
    }
  });
}

/**
 * Closes the connection
 */
const closeDatabase = () => {
  connection.end();
}

/**
 * Adds all the user's tracks to the database
 * @param {*} offset 
 * @param {*} userId 
 * @param {*} getTracksFn 
 */
const addTracks = (offset, userId, getTracksFn) => {
  getTracksFn({
    limit: 50,
    offset: offset
// After receiving the tracks...
}).then((tracks) => {
    var trackIds = [];
    // For each track...
    tracks.body.items && tracks.body.items.forEach((track) => {
        // Save the track id
        trackIds.push(track.track.id);
    });
    // Get the audio features and add the new track item to the array of tracks to add to the database
    spotifyApi.getAudioFeaturesForTracks(trackIds).then((audioFeatures) => {
        audioFeatures.body.audio_features.forEach((feature, index) => {
            // add to song table...
            let song = {
                ...feature,
                songName: tracks.body.items[index].track.name,
                album: tracks.body.items[index].track.album.name
            }
            let artist = {
              id: tracks.body.items[index].track.artists[0].id,
              name: tracks.body.items[index].track.artists[0].name
            }
            let album = {
              id: tracks.body.items[index].track.album.id,
              name: tracks.body.items[index].track.album.name
            }
            if (song.id != "undefined" && userId && artist.id && album.id) {
              addToDatabase(song, artist, album, userId);
            }
        });
        if (tracks.body.next) {
            addTracks(offset + 50, userId, getTracksFn);
        }
    }).catch((e) => console.log(e))
}).catch((e) => console.log(e));
}

/**
 * Adds all of the user's saved tracks to the database
 * @param {*} offset 
 * @param {*} userId 
 */
const addSavedTracks = (offset, userId) => {
    spotifyApi.getMySavedTracks({
        limit: 50,
        offset: offset
    // After receiving the tracks...
    }).then((tracks) => {
        var trackIds = [];
        // For each track...
        tracks.body.items && tracks.body.items.forEach((track) => {
            // Cache this track
            this[track.track.id] = true;
            // Save the track id
            trackIds.push(track.track.id);
        });
        // Get the audio features and add the new track item to the array of tracks to add to the database
        spotifyApi.getAudioFeaturesForTracks(trackIds).then((audioFeatures) => {
            audioFeatures.body.audio_features.forEach((feature, index) => {
                // add to song table...
                let song = {
                    ...feature,
                    songName: tracks.body.items[index].track.name,
                    album: tracks.body.items[index].track.album.name
                }
                let artist = {
                  id: tracks.body.items[index].track.artists[0].id,
                  name: tracks.body.items[index].track.artists[0].name
                }
                let album = {
                  id: tracks.body.items[index].track.album.id,
                  name: tracks.body.items[index].track.album.name
                }
                if (song.id != "undefined" && userId && artist.id && album.id) {
                  addToDatabase(song, artist, album, userId);
                }
            });
            if (tracks.body.next) {
                addSavedTracks(offset + 50, userId);
            }
        }).catch((e) => console.log(e))
    }).catch((e) => console.log(e));
}

/**
 * Adds the tracks from the user's playlists to the database
 * @param {*} offset 
 * @param {*} userId 
 */
const addPlaylistHelper = (offset, userId) => {
    spotifyApi.getUserPlaylists({
      limit: 50,
      offset: 0
    }).then(playlists => {
      playlists.body.items.forEach(playlist => {
        const getPlaylistTracks = spotifyApi.getPlaylistTracks.bind(spotifyApi);
        const fn = (obj) => {
          return getPlaylistTracks(playlist.id, obj);
        }
        addTracks(0, userId, fn);
      })
      if (playlists.body.next) {
        addPlaylistHelper(offset + 50, userId);
      }
    })
  }

  /**
   * Gets the user's id
   */
const getUserId = async () => {
  return spotifyApi.getMe().then(({body}) => {
    userSpotifyId = body.id;
    addUser(body.id, body.display_name);
    return body.id;
  })
}

/**
 * Gets the user's profile information
 */
const getUser = async () => {
  return spotifyApi.getMe().then(({body}) => {
    return body;
  });
}

  /**
   * Adds the user's playlists to the database
   */
const addUserPlaylistsToDatabase = async () => {
  let id = await getUserId();
  addPlaylistHelper(0, id);
}


/**
 * Returns whether the current user is already in the database
 */
const isUserInDatabase = async () => {
  return getUser().then(({ id, display_name }) => {
    return connection.promise().query(`SELECT user_id FROM users`).then(([rows,fields]) => {
      const userIds = rows.map((row) => row.user_id);
      if (userIds.includes(id)) {
        userSpotifyId = id;
        return true;
      }
      else {
        addUser(id, display_name);
        userSpotifyId = id;
        return false;
      }
    })
    .catch((e) => {
      console.log("ERROR: ", e)
      false;
    })
  })
}
/**
 * Adds the user's saved songs to the database
 */
const addUserLibraryToDatabase = () => {
    spotifyApi.getMe().then(({body}) => {
      userSpotifyId = body.id;
      addUser(body.id, body.display_name);
      addTracks(0, body.id, spotifyApi.getMySavedTracks.bind(spotifyApi));
    }).catch((err) => {
      throw err;
    })
}

/**
 * ************************************************************************************
 * ************************** API REQUESTS TO OUR SERVER ******************************
 * ************************************************************************************
 */
/**
 * Gets 3 random songs from the database
 */
app.get('/api/getRandomSongsAnon', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let sql = `SELECT * from songs ORDER BY RAND() LIMIT 3`;
  connection.promise().query(sql).then(([rows, fields]) => {
    res.send(JSON.stringify({
      rows: rows,
      fields: fields
    }));
  }).catch(e => {
    console.log(e)
  })

})
/**
 * Gets 3 random songs from the database for the current user
 */
app.get('/api/getRandomSongsUser', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let sql = `SELECT * from user_songs JOIN songs ON user_songs.song_id = songs.song_id
   WHERE user_songs.user_id = ${userSpotifyId} ORDER BY RAND() LIMIT 3`;
  connection.promise().query(sql).then(([rows, fields]) => {
    res.send(JSON.stringify({
      rows: rows,
      fields: fields
    }))
  })
  .catch(e => {
    console.log(e);
  });
});

/**
 * Used to test api
 */
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

/**
 * Logs into the database using the given credentials
 */
app.get('/api/databaseLogin', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let username = req.query.usr;
  let password = req.query.pw;
  var serverName = "localhost";
  var portNumber = 3306;
  var db = "spotifyApp";
  connection = mysql.createConnection({
    host     : serverName,
    user     : username,
    password : password,
    database : db,
    port     : portNumber
  });
  connection.promise().connect().then(r => {
    res.send(JSON.stringify({success: true}))
  }).catch(e => {
    console.log("PRINTED ERROR", e);
    if (e.errno === invalidPasswordErrNo) {
      res.setHeader('message', 'Invalid username or password');
      res.status(401).send({
        status: "Unauthorized",
        message: "Invalid username or password"
      });
    }
    else {
      res.setHeader('message', e.sqlMessage);
      res.status(404).send({
        status: "Error",
        message: e.sqlMessage
      })
    }
  });
});

/**
 * Removes the playlist from the database with the given id
 */
app.get('/api/removePlaylist', (req, res) => {
  const id = req.query.id;
  res.setHeader('Content-Type', 'application/json');
  if (!id) {
    throw new Error("Invalid argument for remove playlist:", id);
  }
  removePlaylist(id).then((resp) => res.send(JSON.stringify(resp)));
})

/**
 * Gets the user's songs from the database
 */
app.get('/api/getSongs', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ songs: getUserSongsFromDatabase() }))
})

/**
 * Gets the user's profile
 */
app.get('/api/getUser', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  getUser().then((profile) => {
    res.send(JSON.stringify(profile))
  })
})

/**
 * Gets the user's playlists
 */
app.get('/api/getPlaylists', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  getPlaylists().then(([ rows, fields ]) => {
    res.send(JSON.stringify({
      rows: rows[0], fields: fields[0]
    }));
  })
})

/**
 * Gets the tracks in the given playlist
 */
app.get('/api/getPlaylistTracks', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  getPlaylistTracks(req.query.id).then(([ rows, fields ]) => {
    res.send(JSON.stringify({
      rows: rows[0], fields: fields[0]
    }));
  })
})

/**
 * Updates the given playlist field with the given id
 */
app.get('/api/updatePlaylistField', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.query.id || (!req.query.desc && !req.query.title)) {
    console.log("Invalid args", req.query.id, req.query.title);
    throw new Error("Invalid arguments for updating playlist field: " + req.query);
  }
  if (req.query.desc) {
    res.send(JSON.stringify(updatePlaylistField(req.query.id, "playlist_description", req.query.desc)));
  }
  else {
    res.send(JSON.stringify(updatePlaylistField(req.query.id, "playlist_name", req.query.title)));
  }
});

/**
 * Gets a random song
 */
app.get('/getRandomSong', function(req, res) {
  let track = 0
  res.setHeader('Content-Type', 'application/json');
  getRandomSongs().then(tracks => res.send(JSON.stringify({ tracks })));
});

/**
 * Generates the user's playlist based on the given quiz answers
 * Calls generate_playlist in database
 */
app.get('/genPlaylist', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  // generate unique id
  const body = req.query;
  const newPlaylistId = new Date().getUTCMilliseconds().toString();
  const defaultDescription = `Playlist created on ${moment().format("YYYY-MM-DD")}`;
  const { numSongs, acousticness, acousticnessWeight, danceability, 
    danceabilityWeight, energy, energyWeight, instrumentalness,
    instrumentalnessWeight, loudness, loudnessWeight, valence, 
    valenceWeight, tempo, tempoWeight } = body;
  let sql = `CALL add_playlist("${userSpotifyId}","${newPlaylistId}","My New Playlist","${defaultDescription}")`;
  connection.promise().query(sql).then(r => {
    sql = `CALL generate_playlist("${userSpotifyId}","${newPlaylistId}",
      "${numSongs.trim()}",
      "${acousticness.trim()}","${acousticnessWeight.trim()}",
      "${danceability.trim()}","${danceabilityWeight.trim()}","${energy.trim()}","${energyWeight.trim()}",
      "${instrumentalness.trim()}","${instrumentalnessWeight.trim()}",
      "${loudness.trim()}","${loudnessWeight.trim()}","${valence.trim()}","${valenceWeight.trim()}",
      "${tempo.trim()}","${tempoWeight.trim()}")`;
    connection.promise().query(sql).then(r => {
      getPlaylistTracks(newPlaylistId).then(([ rows, fields ]) => {
        res.send(JSON.stringify({
          playlist_id: newPlaylistId,
          tracks: rows[0]
        }))
      })
    }).catch(e => console.log("ERROR IN GENERATE_PLAYLIST", e))
  }).catch(e => console.log("ERROR IN SERVER", e));
  
});

/**
 ******************************************************************************
 ********************** CONNECTING TO SPOTIFY'S WEB API ***********************
 ******************************************************************************
 */

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // requests authorization
  var scope = 'user-read-private user-read-email user-library-read playlist-read-collaborative playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {
  // request refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token,
        refresh_token = body.refresh_token;

        spotifyApi.setAccessToken(access_token);
        isUserInDatabase().then((isInDatabase) => {
          if (!isInDatabase) {
            addUserLibraryToDatabase(); // TODO: only call this if user is not in the database already...
          }
        });
        // TODO: handle error (statusCode 429, too many requests)
        res.redirect('http://localhost:3000/#token=true');
      } 
    });
  }
});


refresh = () => {
  // requesting access token from refresh token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
    } else console.log(response.statusCode)
  });
};

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);