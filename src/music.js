import React, { Component } from 'react';
import reactPlayButton from "react-play-button";


class Music extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false
        
          };
        
        this.audio = new Audio(this.props.url)
        
        }
  
    componentDidMount() {
      this.audio.addEventListener('ended', () => this.setState({ play: false }));
    }
  
    componentWillUnmount() {
      this.audio.removeEventListener('ended', () => this.setState({ play: false }));  
    }
  
    togglePlay = () => {
        console.log(this.props.url)
      this.setState({ play: !this.state.play }, () => {
        this.state.play ? this.audio.play() : this.audio.pause();
      });
    }
  
    render() {
      return (
        <div>
          <img src={this.props.image} />
          <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button>
        </div>
      );
    }
  }
  
  export default Music;