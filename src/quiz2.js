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


        weights:[0,0,0],

        acousticness: [0,0,0],
        danceability: [0,0,0],
        energy: [0,0,0],
        instrumentalness: [0,0,0],
        loudness: [0,0,0],
        valence: [0,0,0],
        tempo: [0,0,0],

        hasSongsToDisplay: true,
        isSure:false,
  
  
        checked:false,
        ratings: [0,0,0]
  
      };
      // this.handleChange = this.handleChange.bind(this);
      // this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    checkboxes = songid => {
        return(
            <>
            <h3>
                Currently, what are you favorite features about this song?
            </h3>
            <form>
            <label>
              Is going:
              <input
                name="The Acousticness Level"
                type="checkbox"
                checked={this.state.acousticness[songid]}
                onChange={val => {                    
                    this.setState(
                        {acousticness:this.state.acousticness.map((rate, index) => 
                            index === songid  ? !rate : rate
                          )})} }/>
            </label>
            <br />
            <label>
              The dancability level:
              <input
                name="The dancability"
                type="checkbox"
                value={this.state.danceability[songid]}
                onChange={val => {
                    this.setState({danceability: this.state.danceability.map((rate, index) => 
                        index === songid  ? !rate : rate
                      )})} }/>
            </label>
            <br />
            <label>
              The energy level:
              <input
                name="The Energy Level"
                type="checkbox"
                value={this.state.energy[songid]}
                onChange={val => {
                    this.setState({energy: this.state.energy.map((rate, index) => 
                        index === songid  ? !rate : rate
                      )})} }/>
            </label>
            <br />
            <label>
              The level of instrumentalism vs vocals:
              <input
                name="the level of instrumentalism/vocals"
                type="checkbox"
                value={this.state.instrumentalness[songid]}
                onChange={val => {
                    this.setState({instrumentalness: this.state.instrumentalness.map((rate, index) => 
                        index === songid  ? !rate : rate
                      )})} }/>
            </label>
            <br />
            <label>
              The loudness level:
              <input
                name="the level of loudness"
                type="checkbox"
                value={this.state.loudness[songid]}
                onChange={val => {
                    this.setState({loudness: this.state.loudness.map((rate, index) => 
                        index === songid  ? !rate : rate
                      )})} }/>
            </label>
            <br />
            <label>
              The happiness level:
              <input
                name="the happiness level"
                type="checkbox"
                value={this.state.valence[songid]}
                onChange={val => {
                    this.setState({valence: this.state.valence.map((rate, index) => 
                        index === songid  ? !rate : rate
                      )})} }/>
            </label>
            <br />
            <label>
            The level of tempo:
              <input
                name="the level of tempo"
                type="checkbox"
                value={this.state.tempo[songid]}
                onChange={val => {
                    this.setState({tempo: this.state.tempo.map((rate, index) => 
                        index === songid  ? !rate : rate
                      )})} }/>
            </label>
    
          </form>
          </>
        )
    }

    calculate = () => {

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
                {this.checkboxes(0)}
                </Music></div>
              <div style={columnStyle}>
                <Music url={this.state.song2play} image={this.state.pic2}>
                  {this.renderRating(2)}
                {this.checkboxes(1)}
                </Music></div>
              <div style={columnStyle}>
                <Music url={this.state.song3play} image={this.state.pic3}>
                  {this.renderRating(3)}
                {this.checkboxes(2)}
                </Music></div>
          </div>
          <div style={{
              ...rowStyle,
              justifyContent: 'center'
          }}>
              <button onClick={this.calculate()}>
                  Get me Playlist Please!
              </button>
          </div>
          </>
        )}
    }
  