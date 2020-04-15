import React, { Component } from 'react';
import { QuizComponent } from './QuizComponent';

export class QuizView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songCount: 20,
      selection: null,
      quizVersion: null
    }
  }
  render() {
    const buttonStyle = {
      color: 'white',
      border: 'none',
      margin: '15px',
      borderRadius: '5px',
      padding: '15px 32px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px'
    }
    const selectMusicButtonStyle = {
      backgroundColor: '#555555'
    }
    const selectPlaylistButtonStyle = {
      backgroundColor: '#e7e7e7',
      color: 'black'
    }
    const divStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center'
    }
    const getView = () => {
      if (!this.state.selection) {
        return (
          <div>
            <div style={divStyle}><h1>Spotify Music Selector</h1></div>
            <div style={divStyle}><h3>In what form do you want your music selection?</h3></div>
            <div style={divStyle}><label>Select "song" if you'd like us to select a single track for you.<br />
            Input a number of songs and select "playlist" if you'd like us to curate a playlist.</label></div>
            <div style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '40px',
              flexDirection: 'row'
            }}><div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}><button style={{
              ...buttonStyle, ...selectMusicButtonStyle
            }} onClick={() => this.setState({
              selection: "song"
            })}>Song</button></div>
            <div style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'column'
            }}>
              <label>Number of songs:<br />
              <input type="number" value={this.state.songCount} min={1} max={250} onChange={e => this.setState({
                songCount: e.target.value
              })} style={{ marginTop: '5px', width: '110px' }}/>
              </label>
              <button style={{
              ...buttonStyle,
              ...selectPlaylistButtonStyle
            }} onClick={() => this.setState({
              selection: "playlist"
            })}>Playlist</button></div>
            </div>
          </div>
        )
      }
      if (!this.state.quizVersion) {
        return (
          <div>
            <div style={divStyle}><h1>Spotify Music Selector</h1></div>
            <div style={divStyle}><h3>Do you know what you want?</h3></div>
            <div style={divStyle}><label>Select "I'm sure" if you feel confident rating specific characteristics you want in your music (e.g. danceability, valence, etc.)<br />
            Select "I'm not sure" if you'd need a more vague set of questions.</label></div>
            <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px',
            flexDirection: 'row'
          }}><button style={{
              ...buttonStyle, ...selectMusicButtonStyle
            }} onClick={() => this.setState({
              quizVersion: "sure"
            })}>I'm sure</button>
            <button style={{
              ...buttonStyle,
              ...selectPlaylistButtonStyle
            }} onClick={() => this.setState({
              quizVersion: "not sure"
            })}>I'm not sure</button>
            </div>
          </div>
        )
      }
      return <QuizComponent isSure={this.state.quizVersion === "sure"} songCount={(this.state.selection === "playlist" && this.state.songCount) || 1} />
    };
    const newButtonStyle = {
      ...buttonStyle,
      color: 'white',
      padding: '10px',
      backgroundColor: '#191414'
    }
    return (<div><div>{getView()}</div>
    {this.props.navToProfile && <div style={{ 
      display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '100px'
      }}>
        <button style={newButtonStyle} onClick={this.props.navToProfile}>Back to my profile</button>
        <button style={newButtonStyle} onClick={this.props.navToPlaylists}>
        View my playlists
      </button>
    </div>}</div>)
  }
}