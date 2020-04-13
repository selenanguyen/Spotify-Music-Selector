import React, { Component } from 'react';
import './App.css';
const moment = require('moment');

export class ViewPlaylists extends Component {
  constructor(props) {
    super(props);
    this.trackFields = {
      ["Title"]: "song_name",
      ["Artist"]: "artist_name",
      ["Album"]: "album_name",
      ["Date added"]: "date_created"
    }
    this.onUpdateInputToDatabase = this.onUpdateInputToDatabase.bind(this);
    this.isPlaylistInputFieldUpdated = this.isPlaylistInputFieldUpdated.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.removePlaylist = this.removePlaylist.bind(this);
    this.state = {
      playlists: null,
      playlistInputFields: {},
      originalInputState: null
    }
  }
  componentWillMount() {
    if (!this.state.playlists) {
      // fetch playlists and playlist tracks
      fetch('/api/getPlaylists').then((response) => response.json())
      .then((jsonresponse) => {
        const { rows, fields } = jsonresponse;
        let newRows = [];
        let playlistInputFields = {};
        if (!rows.length) {
          this.setState({
            playlists: []
          })
        }
        rows.forEach((row, index) => {
          this.fetchPlaylistTracks(row.playlist_id)
          .then((tracks) => {
            let newRow = {
              ...row,
              tracks: tracks
            }
            playlistInputFields[row.playlist_id] = {
              title: row.playlist_name,
              desc: row.playlist_description
            };
            newRows.push(newRow);
            if (newRows.length == rows.length) {
              this.setState({
                playlistInputFields: playlistInputFields,
                originalInputState: { ...playlistInputFields },
                playlists: newRows
              })
              console.log(newRows);
              console.log(playlistInputFields);
              console.log(this.state.originalInputState);
            }
          })
        });
      })
    }
  }

  async fetchPlaylistTracks(id) {
    return fetch(`/api/getPlaylistTracks?id=${encodeURIComponent(id)}`)
    .then((response) => response.json())
    .then((jsonresponse) => {
      const { rows, fields } = jsonresponse;
      rows.forEach((row) => {
        row["date_created"] = moment(row["date_created"]).utc().format("YYYY-MM-DD");
      });
      //rows[date_created] = moment(rows.date_created).utc().format("YYYY-MM-DD");
      //console.log(rows.date_created, moment(rows.date_created).utc().format("YYYY-MM-DD"));
      return rows;
    })
  }

  onInputChange(playlistId, value, field) {
    this.setState({
      ...this.state,
      playlistInputFields: {
        ...this.state.playlistInputFields,
        [playlistId]: {
          ...this.state.playlistInputFields[playlistId],
          [field]: value
        }
      }
    });
  }

  onUpdateInputToDatabase(playlistId, field) {
    // event.preventDefault();
    // fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
    //   .then(response => response.json())
    //   .then(state => this.setState(state));

    fetch(`api/updatePlaylistField?id=${encodeURIComponent(playlistId)}&${field}=${encodeURIComponent(this.state.playlistInputFields[playlistId][field])}`)
    .then((response) => response.json())
    .then((jsonresponse) => {
      this.setState({
        ...this.state,
        originalInputState: {
          ...this.state.originalInputState,
          [playlistId]: {
            ...this.state.originalInputState[playlistId],
            [field]: this.state.playlistInputFields[playlistId][field]
          }
        }
      })
    })
  }

  removePlaylist(id) {
    fetch(`api/removePlaylist?id=${encodeURIComponent(id)}`)
    .then(this.setState({
      playlists: this.state.playlists.reduce((prevValue, curValue, index) => 
        curValue.playlist_id === id ? prevValue : prevValue.concat(curValue), [])
    }))
  }

  isPlaylistInputFieldUpdated(playlistId, field) {
    console.log(this.state.originalInputState, playlistId, field);
    if (!this.state.originalInputState) {
      return false;
    }
    return this.state.originalInputState[playlistId][field] != this.state.playlistInputFields[playlistId][field];
  }

  render() {
    const tablesLayout = {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column'
    }
    const cellStyle = {
      color: 'white',
      //backgroundColor: '#191414',
      textAlign: 'left',
      padding: "10px",
      paddingLeft: "15px",
      paddingRight: "15px",
      minWidth: "110px",
      borderRadius: '5px'
    }
    const thstyle = {
      ...cellStyle,
      textAlign: 'left',
      //padding: '15px'
      //textAlign: 'center'
      //width: '10%'
    }

    const buttonStyle = {
      color: 'white',
      border: 'none',
      margin: '15px',
      //border: '1px solid #191414',
      backgroundColor: '#191414',
      borderRadius: '5px',
      padding: '10px 20px',
      textAlign: 'center',
      marginTop: '10px',
      marginBottom: '30px',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '13px'
    }

    const labelStyle = {
      //marginTop: '-10px',
      marginBottom: '10px'
    }

    const backToProfileButtonStyle = {
      ...buttonStyle,
      marginTop: '-50px',
      backgroundColor: '#555555',
      color: 'white'
    }

    const submitStyle = {
      borderRadius: '2px'
    }

    const tableStyle = {
      backgroundColor: '#191414',
      width: '100%',
      borderCollapse: 'collapse',
      borderColor: 'white',
      borderWidth: '1px',
      borderRadius: '5px',
      //padding: '15px',
      marginTop: '15px'
    }

    if (!this.state.playlists) {
      return <div><h2>Loading your playlists...</h2></div>
    }
    if (!this.state.playlists.length) {
      return <h2>You have no previous playlists.</h2>
    }
    return <div style={tablesLayout}>
    <h2>Playlists we've curated for you.</h2>
    <div><button style={backToProfileButtonStyle} onClick={this.props.navToProfile}>Back to profile</button></div>
    {this.state.playlists.map((playlist) => {
      if (!playlist.tracks || !playlist.playlist_id) {
        console.log('UNDEFINED TRACKS FOR PLAYLIST', playlist, playlist["tracks"]);
        console.log("UNDEFINED ID FOR PLAYLIST", playlist, playlist.playlist_id);
      }
      const id = playlist.playlist_id;
      return <div>
        <div style={{
          textAlign: 'center'
        }}>
          <form style={{ textAlign: 'left' }}><label style={labelStyle} for={`${id} name`}>name: 
            <input style={{ marginLeft: '10px' }} type="text" value={this.state.playlistInputFields[id].title} 
              onChange={(e) => this.onInputChange(id, e.target.value, "title")}
              id={`${id} name`} /></label>
              <input style={{ marginLeft: '10px', ...submitStyle }} type="submit" value="update playlist name"
                onClick={() => this.onUpdateInputToDatabase(id, "title")}
                disabled={!this.isPlaylistInputFieldUpdated(id, "title")} />
              <br />
            <label style={labelStyle} for={`${id} desc`}>description: 
            <input type="text" style={{ marginLeft: '10px', marginTop: '10px' }} 
                value={this.state.playlistInputFields[id].desc}
                id={`${id} desc`} 
                onChange={(e) => this.onInputChange(id, e.target.value, "desc")}
            /></label>
              <input style={{ marginLeft: '10px', ...submitStyle }} type="submit" value="update playlist description"
                onClick={() => this.onUpdateInputToDatabase(id, "desc")}
                disabled={!this.isPlaylistInputFieldUpdated(id, "desc")} />
              <br />
          </form>
        </div>
        <table style={tableStyle}>
          <thead><tr>
          {Object.keys(this.trackFields).map((field) => 
            <th style={thstyle}>{field}</th>
          )}
          </tr>
          </thead>
          <tbody>
          {playlist.tracks.map((track) =>
            <tr>
              {Object.values(this.trackFields).map((field) => {
              return <td style={cellStyle}>
                {track[field]}
              </td>
              })}
            </tr>
          )}
          </tbody>
        </table>
        <button style={buttonStyle} onClick={() => this.removePlaylist(id)}>Remove playlist</button>
      </div>
  })}
    </div>
  }
}