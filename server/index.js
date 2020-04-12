const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');//2/promise');
const SpotifyWebApi = require('spotify-web-api-node');

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


// var express = require('express'); // Express web server framework

var client_id = 'eea02be1f6f34fed9b59426d482c6aee'; // Your client id
var client_secret = '67c0786a03d14feba40f746ad8d846c3'; // Your secret
var redirect_uri = 'http://localhost:3001/callback'; // Your redirect uri
var serverName = "localhost";
var portNumber = 3306;
var userName = 'root', password = 'Selenaxmimi0314!';
var db = "spotifyApp";
var userSpotifyId;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
var connection = mysql.createConnection({
  host     : serverName,
  user     : userName,
  password : password,
  database : db,
  port     : portNumber
});
connection.connect((err) => {
  console.log(err);
});
// connection.query('SELECT * FROM songs', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results);
// });

const duplicateEntryErrNo = 1062;
const entryNameTooLongErrNo = 1406;
const quotationErrNo = 1064;

var spotifyApi = new SpotifyWebApi();

const getUserSongsFromDatabase = () => {
  let sql = `CALL get_all_songs(${userSpotifyId})`;
  return connection.promise().query(sql);
}

const addUser = (id, name) => {
  let sql = `INSERT INTO users(user_id,user_name) VALUES("${id}","${name}")`;
  connection.query(sql, function (error, results, fields) {
    if (error && error.errno != duplicateEntryErrNo) {
      console.log(error);
    }
  })
}

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
      // console.log("ERROR ADDING ARTIST ", artist.name);
      console.log(error);
    }
    else {
      connection.query(addAlbumSql, function (error, results, fields) {
        if (error && error.errno != duplicateEntryErrNo && error.errno != entryNameTooLongErrNo && error.errno != quotationErrNo) {
          console.log("ERROR ADDING ALBUM", album.name);
          // console.log(error);
        }
        else {
          connection.query(addSongSql, function (error, results, fields) {
            if (error && error.errno != duplicateEntryErrNo && error.errno != entryNameTooLongErrNo 
              && error.errno != quotationErrNo && id != undefined) {
              console.log("ERROR ADDING SONG", song.name);
              // console.log(error);
            }
            else {
              connection.query(addUserSongSql, function (error, results, fields) {
                if (error && error.errno != duplicateEntryErrNo && id != undefined) {
                  console.log("ERROR ADDING USER-SONG", song.id, userId);
                  // console.log(error);
                }
                //connection.query()
              })
            }
          });
        }
      });
    }
  });
    // connection.query('SELECT * FROM songs', function (error, results, fields) {
    //   if (error) throw error;
    //   console.log('The solution is: ', results[0].solution);
    // });
    //rl.close();
}



const getUserLibraryFromDatabase = () => {

}

const closeDatabase = () => {
  connection.end();
}

const addTracks = (offset, userId, getTracksFn) => {
  getTracksFn({
    limit: 50,
    offset: offset
// After receiving the tracks...
}).then((tracks) => {
    //console.log(tracks);
    var trackIds = [];
    // For each track...
    tracks.body.items && tracks.body.items.forEach((track) => {
        //console.log("TRACK: " + track);
        // Cache this track
        //this[track.track.id] = true;
        // TODO: add artist and album to database if not exist
        // Save the track id
        trackIds.push(track.track.id);
    });
    //console.log("TRACK IDS: " + trackIds);
    // Get the audio features and add the new track item to the array of tracks to add to the database
    spotifyApi.getAudioFeaturesForTracks(trackIds).then((audioFeatures) => {
        //console.log("AUDIO FEATURES: \n" + audioFeatures);
        //console.log("songs:");
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
            //console.log(song, artist, album);
            //console.log("==============UPDATED SONGS IN DB==============");
            //printSongs();
            //console.log(song);
        });
        if (tracks.body.next) {
            //console.log("next: " + tracks.body.next + "\nRequesting offset " + offset + 50 + "next");
            addTracks(offset + 50, userId, getTracksFn);
        }
    }).catch((e) => console.log(e))
}).catch((e) => console.log(e));
}

const addSavedTracks = (offset, userId) => {
    // console.log("=======================NEW REQUEST===========================");
    // console.log("Retrieving songs at offset " + offset);
    // spotifyApi.getUserPlaylists().then((r) => {
    //     console.log(r);
    // }).catch((e) => {
    //     console.log(e);
    // });
    // spotifyApi.getMySavedTracks({
    //     limit: 50,
    //     offset: offset
    // }).then((response) => {
    //     console.log(response)
    // }).catch((e) => {
    //     console.log("ERROR: " + e);
    // });
    spotifyApi.getMySavedTracks({
        limit: 50,
        offset: offset
    // After receiving the tracks...
    }).then((tracks) => {
        //console.log(tracks);
        var trackIds = [];
        // For each track...
        tracks.body.items && tracks.body.items.forEach((track) => {
            //console.log("TRACK: " + track);
            // Cache this track
            this[track.track.id] = true;
            // TODO: add artist and album to database if not exist
            // Save the track id
            trackIds.push(track.track.id);
        });
        //console.log("TRACK IDS: " + trackIds);
        // Get the audio features and add the new track item to the array of tracks to add to the database
        spotifyApi.getAudioFeaturesForTracks(trackIds).then((audioFeatures) => {
            //console.log("AUDIO FEATURES: \n" + audioFeatures);
            //console.log("songs:");
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
                //console.log(song, artist, album);
                //console.log("==============UPDATED SONGS IN DB==============");
                //printSongs();
                //console.log(song);
            });
            if (tracks.body.next) {
                //console.log("next: " + tracks.body.next + "\nRequesting offset " + offset + 50 + "next");
                addSavedTracks(offset + 50, userId);
            }
        }).catch((e) => console.log(e))
    }).catch((e) => console.log(e));
}


const addPlaylistHelper = (offset, userId) => {
  console.log("=======================NEW REQUEST PLAYLIST===========================");
  console.log("Retrieving playlists at offset " + offset)
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

const getUserId = async () => {
  return spotifyApi.getMe().then(({body}) => {
    //console.log("USER:", body, body.id)
    userSpotifyId = body.id;
    addUser(body.id, body.display_name);
    return body.id;
  })
}

const getUser = async () => {
  return spotifyApi.getMe().then(({body}) => {
    console.log(body);
    return body;
  });
}

  
  
const addUserPlaylistsToDatabase = async () => {
  let id = await getUserId();
  addPlaylistHelper(0, id);
}


const isUserInDatabase = async () => {
  return getUserId().then((id) => {
    return connection.promise().query(`SELECT user_id FROM users`).then(([rows,fields]) => {
      const userIds = rows.map((row) => row.user_id);
      if (userIds.includes(id)) {
        return true;
      }
      else {
        return false;
      }
    })
    .catch((e) => {
      console.log("ERROR: ", e)
      return true;
    })
  })
}

const addUserLibraryToDatabase = () => {
    // let history = {
    //     addToHistory(id) {
    //         this[id] = true;
    //     }
        // TODO: add artists, albums, and songs-to-user to database
    spotifyApi.getMe().then(({body}) => {
      //console.log("USER:", body, body.id)
      userSpotifyId = body.id;
      addUser(body.id, body.display_name);
      addTracks(0, body.id, spotifyApi.getMySavedTracks.bind(spotifyApi));
    }).catch((err) => {
      throw err;
    })
    //{
    //         console.log("in addSavedTracks()");
    //         addSavedTracks(0, this.addToHistory.bind(this));
    //         // Getting every 50 saved tracks until entire library has been added
    //         // while (!isComplete) {
    //         //     console.log("IN WHILE LOOP !!! offset " + offset);
    //         //     }
    //     }
    // }

    // history.addSavedTracks();
}


// const setSpotifyData = () => {
//     if (isUserInDatabase()) {
//         getUserLibraryFromDatabase();
//     }
//     else {
//         addUserLibraryToDatabase();
//     }
// }

/**
 * ************************************************************************************
 * API REQUESTS TO OUR SERVER
 * ************************************************************************************
 */
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/api/getSongs', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ songs: getUserSongsFromDatabase() }))
})

app.get('/api/getUser', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  getUser().then((profile) => {
    res.send(JSON.stringify(profile))
  })
})


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

// already have
// var app = express();

// app.use(express.static(__dirname + '/public'))
//    .use(cors())
//    .use(cookieParser());

app.get('/here', function(req, res) {
    //console.log('7777777')
});

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
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


        //call db, get users
        //does user exist

    
  // your application requests refresh and access tokens
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
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        spotifyApi.setAccessToken(access_token);
        isUserInDatabase().then((isInDatabase) => {
          if (!isInDatabase) {
            addUserLibraryToDatabase(); // TODO: only call this if user is not in the database already...
          }
        });
        // TODO: handle error (statusCode 429, too many requests)

        //addUserPlaylistsToDatabase();
        res.redirect("http://localhost:3000/#token=true");
        //setSpotifyData();

    //     var options = {
    //       url: 'https://api.spotify.com/v1/me',
    //       headers: { 'Authorization': 'Bearer ' + access_token },
    //       json: true
    //     };

    //     // use the access token to access the Spotify Web API
    //     request.get(options, function(error, response, body) {
    //       console.log(body);
    //     });
    
        // we can also pass the token to the browser to make requests from there
        // res.redirect('http://localhost:3000/#token=true');
      } 

      
    //   else {
    //       //Hihg key catch the error
    // //     res.redirect('/#' +
    // //       querystring.stringify({
    // //         error: 'invalid_token'
    // //       }
    // //       ));
    //   }
    });
  }
});


// app.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });
app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);