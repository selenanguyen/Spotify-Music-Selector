import React, { Component } from 'react';
import { PlaylistComponent } from "./PlaylistComponent";
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
    if (this.state.playlists === null) {
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
    fetch(`/api/updatePlaylistField?id=${encodeURIComponent(playlistId)}&${field}=${encodeURIComponent(this.state.playlistInputFields[playlistId][field])}`)
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
    let newPlaylists = [];
    this.state.playlists.forEach((play) => {
      if (play.playlist_id !== id) {
        newPlaylists.push(play)
      }
    });
    this.setState({
      playlists: newPlaylists
    })
  }

  isPlaylistInputFieldUpdated(playlistId, field) {
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
      return <div style={{ display: 'flex', flexDirection: 'column'}}><div><h2>You have no previous playlists.</h2></div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '50px'}}>
        <button style={backToProfileButtonStyle} onClick={this.props.navToProfile}>Back to profile</button>
        </div></div>
    }
    return <div style={tablesLayout}>
    <h2>Playlists we've curated for you.</h2>
    <div><button style={backToProfileButtonStyle} onClick={this.props.navToProfile}>Back to profile</button></div>
    {this.state.playlists.map((playlist) => <PlaylistComponent playlist={playlist} onRemovePlaylist={this.removePlaylist} />)}
    </div>
  }
}