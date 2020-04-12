import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { QuizComponent } from "./QuizComponent.js";

class ViewPlaylists extends Component {
  constructor(props) {
    this.state = {
      playlists: null
    }
  }
  componentWillMount() {
    if (!this.state.playlists) {
      // fetch playlists and playlist tracks
    }
  }
  render() {
    return <>playlists go here</>
  }
}
export class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      isViewingPlaylists: false,
      isGettingMusic: false
    }
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
      return <ViewPlaylists />
    }
    if (this.state.isGettingMusic) {
      return <QuizComponent />
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
            <div style={rightAlignStyle}><a href="http://localhost:3001/login" style={{
          ...buttonStyle, ...selectMusicButtonStyle
        }} onClick={() => this.setState({
          ...this.state,
          isGettingMusic: true
        })}>Get music</a></div>
          </div>
          <div style={columnStyle}>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.email}</dd></div>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.followers.total}</dd></div>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.product}</dd></div>
            <div style={leftAlignStyle}><dd><a href={this.state.userProfile.uri}>{this.state.userProfile.uri}</a></dd>
            <div style={leftAlignStyle}><dd>{this.state.userProfile.country}</dd></div>
            <div style={leftAlignStyle}><a href="http://localhost:3000/#login=true" style={{
          ...buttonStyle,
          ...viewPlaylistsButtonStyle,
          marginLeft: '40px'
        }} onClick={() => this.setState({
          ...this.state,
          isViewingPlaylists: true
        })}>View previously curated playlists</a></div>
          </div>
        </div>
      </div>
      </div>
        
      </div>
    )
  }
}
