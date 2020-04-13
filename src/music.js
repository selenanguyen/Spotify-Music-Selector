import React, { Component } from 'react';

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
      this.setState({ play: !this.state.play }, () => {
        this.state.play ? this.audio.play() : this.audio.pause();
      });
    }
  
    render() {
      const divStyle = {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px'
      }
      return (
        <div style={divStyle}>
          <img src={this.props.image} />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}><button style={{
            marginTop: '10px'
          }} onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button></div>
          {this.props.children}
        </div>
      );
    }
  }
  
  export default Music;