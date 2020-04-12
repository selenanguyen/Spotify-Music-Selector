import React, { Component } from 'react';
import './App.css';

export class ViewPlaylists extends Component {
  constructor(props) {
    super(props);
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