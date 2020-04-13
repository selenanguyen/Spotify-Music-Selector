import React, { Component } from 'react';
import './App.css';
const moment = require('moment');

/**
 * Props:
 * playlist: {
 *    playlist_id: string
 *    tracks: Array<{
 *        ["song_name"]: string,
 *        ["artist_name"]: string,
 *        ["album_name"]: string,
 *        ["date_created"]: date (sql)
 *    }>
 * }
 */
export class PlaylistComponent extends Component {
  constructor(props) {
    super(props);
    this.playlist = props.playlist;
    this.playlist.tracks.forEach((track) => {
      track["date_created"] = moment(track["date_created"]).utc().format("YYYY-MM-DD");
    });  
    this.trackFields = {
      ["Title"]: "song_name",
      ["Artist"]: "artist_name",
      ["Album"]: "album_name",
      ["Date added"]: "date_created"
    }
    this.state = {
      title: this.playlist.playlist_name,
      desc: this.playlist.playlist_description,
      originalInputState: {
        title: this.playlist.playlist_name,
        desc: this.playlist.playlist_description
      }
    }
  }

  onInputChange = (value, field) => {
    this.setState({
      [field]: value
    })
  }

  isPlaylistInputFieldUpdated = (field) => {
    return this.state[field] != this.state.originalInputState[field]
  }

  onUpdateInputToDatabase = (field) => {
    fetch(`api/updatePlaylistField?id=${encodeURIComponent(this.props.playlist.playlist_id)}&${field}=${encodeURIComponent(this.state[field])}`)
    .then((response) => response.json())
    .then((jsonresponse) => {
      this.setState({
        originalInputState: {
          ...this.state.originalInputState,
          [field]: this.state[field]
        }
      })
    })
  }

  removePlaylist = () => {
    console.log("REMOVING PLAYLIST " + this.playlist.playlist_id)
    const id = this.playlist.playlist_id;
    fetch(`api/removePlaylist?id=${encodeURIComponent(this.playlist.playlist_id)}`)
    .then(r => this.props.onRemovePlaylist(id));
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
    const id = this.playlist.playlist_id;
    const playlist = this.playlist;
    console.log("RECEIVING DATE", playlist["date_created"]);
    return <div>
    <div style={{
      textAlign: 'left'
    }}>
      <label style={labelStyle}>name: 
        <input style={{ marginLeft: '10px' }} type="text" value={this.state.title} 
          onChange={(e) => this.onInputChange(e.target.value, "title")}
          id={`${id} name`} /></label>
          <button style={{ marginLeft: '10px' }}
            onClick={() => this.onUpdateInputToDatabase("title")}
            disabled={!this.isPlaylistInputFieldUpdated("title")}>update playlist name</button>
          <br />
        <label style={labelStyle}>description: 
        <input type="text" style={{ marginLeft: '10px', marginTop: '10px' }} 
            value={this.state.desc}
            id={`${id} desc`} 
            onChange={(e) => this.onInputChange(e.target.value, "desc")}
        /></label>
          <button style={{ marginLeft: '10px' }} value="update playlist description"
            onClick={() => this.onUpdateInputToDatabase("desc")}
            disabled={!this.isPlaylistInputFieldUpdated("desc")}>update playlist description</button>
          <br />
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
    {this.props.onRemovePlaylist && <button style={buttonStyle} onClick={this.removePlaylist}>Remove playlist</button>}
  </div>
  }
}