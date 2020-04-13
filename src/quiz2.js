import React, { Component } from 'react';
import Rating from 'react-rating';
import Music from './music.js';
import 'rc-checkbox/assets/index.css';
import Checkbox from 'rc-checkbox';
import ReactDOM from 'react-dom';






songpicker = () => {
    return(

    )
  }



  export class QuizPart2 extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isSure: true,
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        loudness: 0,
        valence: 0,
        tempo: 0,
        acousticnessWeight: 0,
        danceabilityWeight: 0,
        energyWeight: 0,
        instrumentalnessWeight: 0,
        loudnessWeight: 0,
        valenceWeight: 0,
        tempoWeight: 0,
  
  
        inputsAcc:[],
  
        //what they like about hte song
        song1id: this.props.,
        song1play: null,
        pic1: null,
        song2id: null,
        song2play: null,
        pic2: null,
        song2id:null,
        song2play: null,
        pic3: null,
        hasSongsToDisplay: false,
        isloading:false,
  
  
  
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
  