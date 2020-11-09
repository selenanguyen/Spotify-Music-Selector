## Description

This is a full stack web application that either selects a track or curates a playlist for a user based on answers to quiz questions on their Spotify library.

## Run the application

In the project directory, run:

### `npm install`

Then run:

### `npm run dev`

If the application doesn't open automatically after a minute or two, open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br />
If the build breaks because of a required module, navigate to <code>/Spotify-Music-Selector/src</code> and run <code>npm install</code> again. Then navigate back to the project directory and run <code>npm run dev</code> and repeat steps 3-4.

## Logging into Spotify
If you don’t have a Spotify or don’t want to log in using your account, email us (reppucci.a@husky.neu.edu or nguyen.se@husky.neu.edu) and we can provide a login.

## Important notes about application behavior
* Upon your first login to our application (via Spotify), your entire Spotify music library (i.e. saved songs) and user profile are added to our database (tables: songs, users, user_songs) via Spotify’s web API. Our backend only adds your data if you don’t already exist in the database.
    * This restricts you from adding additional music to our database after your first login.
* Our application curates your playlist using our own calculations in the backend, not through Spotify’s API. We save and use Spotify’s song data (e.g. a track’s danceability, speechiness, etc.) to make these calculations.

<br /><br />
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


