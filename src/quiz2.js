import React, { Component } from 'react';
import Rating from 'react-rating';
import Music from './music.js';
import 'rc-checkbox/assets/index.css';
import Checkbox from 'rc-checkbox';
import ReactDOM from 'react-dom';



 export class QuizPart2 extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
        isloading:false,
        song1id: this.props.songData[0].id,
        song1play: this.props.songData[0].preview_url,
        pic1: this.props.songData[0].album.images[1].url,
        song2id: this.props.songData[1].id,
        song2play: this.props.songData[1].preview_url,
        pic2: this.props.songData[1].album.images[1].url,
        song3id: this.props.songData[2].id,
        song3play: this.props.songData[2].preview_url,
        pic3: this.props.songData[2].album.images[1].url,
        hasSongsToDisplay: true,
        isSure:false,
  
  
        checked:false,
        ratings: [0,0,0]
  
      };
      // this.handleChange = this.handleChange.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
    }

    renderRating = (songid) => {
      return <div style={{
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}><Rating initialRating={this.state.ratings[songid - 1]} start={0} stop={5}
        onChange={(value) => this.setState({
          ratings: this.state.ratings.map((rate, index) => 
            index === songid - 1 ? value : rate
          )}
      )} /></div>
    }

    render() {
      const rowStyle = {
        display: 'flex',
        flexDirection: 'row'
      }
      const columnStyle = {
        display: 'flex',
        flexDirection: 'column'
      }
        return (<><div style={{
          ...rowStyle,
          justifyContent: 'center'
        }}><h2>Rank the following tracks and give us your opinions.</h2></div>
            <div style={rowStyle}>
              <div style={columnStyle}>
                <Music url={this.state.song1play} image={this.state.pic1}>
                  {this.renderRating(1)}
                {/* insert form here */}
                </Music></div>
              <div style={columnStyle}>
                <Music url={this.state.song2play} image={this.state.pic2}>
                  {this.renderRating(2)}
                {/* insert form here */}
                </Music></div>
              <div style={columnStyle}>
                <Music url={this.state.song3play} image={this.state.pic3}>
                  {this.renderRating(3)}
                {/* insert form here */}
                </Music></div>
          </div>
          </>
        )}
    }
  