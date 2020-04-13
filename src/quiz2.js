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
  
  
        checked:false
  
      };
      // this.handleChange = this.handleChange.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
    }
    

    render() {
        return (
            <>
            <Music url={this.state.song1play} image={this.state.pic1}></Music>
            <Music url={this.state.song2play} image={this.state.pic2}></Music>
            <Music url={this.state.song3play} image={this.state.pic3}></Music>
            <label>
                    <Checkbox
                      checked={this.state.checked}
                      onChange={value => {
                        console.log(value)
                        this.setState({checked:!this.state.checked})
                      }}
                      disabled={this.state.disabled}
                    />
                    &nbsp; controlled checked rc-checkbox
            </label>
      
            
          </>
        )}
    }
  