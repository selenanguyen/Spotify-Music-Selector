import React, { Component } from 'react';
import './App.css';
import { QuizComponent } from "./QuizComponent.js";
import { ViewPlaylists } from "./ViewPlaylists.js";

export class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      isViewingPlaylists: false,
      isGettingMusic: false
    }
    this.navBackToProfile = this.navBackToProfile.bind(this);
    this.navToPlaylists = this.navToPlaylists.bind(this);
  }
  componentWillMount() {
    if (!this.state.userProfile) {
      fetch(`/api/getUser`)
      .then(response => response.json())
      .then(jsonresponse => {
        console.log("RECEIVED IN CLIENT:", jsonresponse);
        this.setState({
          ...this.state,
          userProfile: jsonresponse
        })
      });
    }
  }

  navBackToProfile() {
    this.setState({
      ...this.state,
      isViewingPlaylists: false,
      isGettingMusic: false
    })
  }

  navToPlaylists() {
    this.setState({
      ...this.state,
      isGettingMusic: false,
      isViewingPlaylists: true
    })
  }

  render() {
    const buttonStyle = {
      marginTop: '40px',
      color: 'white',
      border: 'none',
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
    const viewPlaylistsButtonStyle = {
      backgroundColor: '#e7e7e7',
      color: 'black'
    }
    const outerDivStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center'
    }
    const rowStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    }
    const columnStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
    const verticalCenter = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
    const rightAlignStyle = {
      textAlign: 'right'
    }
    const leftAlignStyle = {
      textAlign: 'left'
    }
    if (!this.state.userProfile) {
      return (
        <div><h2>Loading your profile...</h2></div>
      )
    }
    if (this.state.isViewingPlaylists) {
      return <ViewPlaylists navToProfile={this.navBackToProfile} />
    }
    if (this.state.isGettingMusic) {
      return <QuizComponent navToPlaylists={this.navToPlaylists} navToProfile={this.navToProfile} />
    }
    return (
      <div style={outerDivStyle}>
        <div style={rowStyle}>
          <div style={{
            ...verticalCenter,
            marginRight: "10px"
            }}><img className="media-object" width="150" src={this.state.userProfile.images.length && this.state.userProfile.images[0].url} /></div>
          <div style={{
            ...verticalCenter,
            marginLeft: "10px"
            }}><h1>Welcome, {this.state.userProfile.display_name}</h1></div>
        </div>
      <div style={{
        display: "block",
        marginTop: '20px'
      }}>
        <div style={rowStyle}>
          <div style={columnStyle}>
            <div style={rightAlignStyle}><dt>Email</dt></div>
            <div style={rightAlignStyle}><dt>Followers</dt></div>
            <div style={rightAlignStyle}><dt>Subscription level</dt></div>
            <div style={rightAlignStyle}><dt>Spotify URI</dt></div>
            <div style={rightAlignStyle}><dt>Country</dt></div>
            <div style={rightAlignStyle}><button style={{
          ...buttonStyle, ...selectMusicButtonStyle
        }} onClick={() => this.setState({
          ...this.state,
          isGettingMusic: true
        })}>Get music</button></div>
          </div>
          <div style={columnStyle}>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.email}</dd></div>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.followers.total}</dd></div>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.product}</dd></div>
            <div style={leftAlignStyle}><dd><a href={this.state.userProfile.uri}>{this.state.userProfile.uri}</a></dd>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.country}</dd></div>
            <div style={leftAlignStyle}><button style={{
          ...buttonStyle,
          ...viewPlaylistsButtonStyle,
          marginLeft: '40px'
        }} onClick={() => this.setState({
          ...this.state,
          isViewingPlaylists: true
        })}>View playlists</button></div>
          </div>
        </div>
      </div>
      </div>
        
      </div>
    )
  }
}
