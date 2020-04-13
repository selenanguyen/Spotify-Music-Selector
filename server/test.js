const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');//2/promise');
const SpotifyWebApi = require('spotify-web-api-node');
const moment = require('moment');
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

/**
 * *******************************************************
 * ******************* SQL CONNECTION ********************
 * *******************************************************
 */
var serverName = "localhost";
var portNumber = 3306;
var userName = 'root', password = 'Selenaxmimi0314!';
var db = "spotifyApp";
var userSpotifyId = '1252205107';

var connection = mysql.createConnection({
  host     : serverName,
  user     : userName,
  password : password,
  database : db,
  port     : portNumber
});
var spotifyApi = new SpotifyWebApi();

// Error numbers we can ignore and skip adding to the database
const duplicateEntryErrNo = 1062;
const entryNameTooLongErrNo = 1406;
const quotationErrNo = 1064;

/**
 * *******************************************************
 * ********** Helper calls to the database ***************
 * *******************************************************
 */

/**
 * Gets all songs belonging to the current user
 */
const getUserSongsFromDatabase = () => {
  let sql = `CALL get_all_songs(${userSpotifyId})`;
  return connection.promise().query(sql);
}

const getPlaylists = () => {
  let sql = `CALL get_playlists(${userSpotifyId})`
  return connection.promise().query(sql).then((response) =>{
    console.log(response);
    return response;
  });
}



/**
 * Closes the connection
 */
const closeDatabase = () => {
  connection.end();
}

// getPlaylists().then(([rows, fields]) => {
//   console.log("ROWS: ", rows[0][0].user_name);
// })

const getPlaylistTracks = (playlistId) => {
  console.log("GETTING PLAYLISTS FOR PLAYLIST " + playlistId);
  let sql = `CALL get_playlist_songs('${playlistId}')`
  return connection.promise().query(sql).then((response) =>{
    console.log(response);
    return response;
  }).catch((e) => {
    console.log("ERROR:", e);
  });
}

// getPlaylistTracks("playlist1").then((response) => {
//   const [ rows, fields ] = response;
//   console.log("ROWS", rows[0], "FIELDS", fields[0]);
// })
