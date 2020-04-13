import React, { Component } from 'react';
import Rating from 'react-rating';
import Music from './music.js'

export class QuizComponent extends Component {
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

      //what they like about hte song
      song1id: null,
      song1play: null,
      pic1: null,
      song2id: null,
      song2play: null,
      pic2: null,
      song2id:null,
      song2play: null,
      pic3: null,
      hasSongsToDisplay: false,
      isloading:false

    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChange(event) {
  //   this.setState({ name: event.target.value });
  // }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
  //     .then(response => response.json())
  //     .then(state => this.setState(state));
  // }

  callGenerateSong = () => {
    if(this.state.isloading){
      return
    }
    this.setState({isloading:true})
    fetch('http://localhost:3001/getRandomSong')
    .then((response) => {
      return response.json();
    })
    .then((track) => {
      let data = track.tracks
      this.setState({isloading:false,
        song1id: data[0].id,
        song1play: data[0].preview_url,
        pic1: data[0].album.images[1].url,
        song2id: data[1].id,
        song2play: data[1].preview_url,
        pic2: data[1].album.images[1].url,
        song3id: data[2].id,
        song3play: data[2].preview_url,
        pic3: data[2].album.images[1].url,
        hasSongsToDisplay: true,
        isSure:false,

    })
  })
}



  sure = () => {
    const columnStyle = {
      margin: '10px'
    }
    return(<>
  <h1> I know What I want (Only pick what you care about)</h1>
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
  <div style={columnStyle}>
  <h5> Acousticness Level </h5>
  <Rating initialRating={this.state.acousticness} start={0} stop={10} onChange={value => {this.setState({acousticness:value})}}/>

  <h5> Dancability  </h5>
  <Rating initialRating={this.state.danceability} start={0} stop={10} onChange={value => {this.setState({danceability:value})}}/>

  <h5> Energy Level </h5>
  <Rating initialRating={this.state.energy} start={0} stop={10} onChange={value => {this.setState({energy:value})}}/>

  <h5> Instrumentalness </h5>
  <Rating initialRating={this.state.instrumentalness} start={0} stop={10} onChange={value => {this.setState({instrumentalness:value})}}/>
  </div>
  <div style={columnStyle}>
  <h5> Happiness Level </h5>
  <Rating initialRating={this.state.valence} start={0} stop={10} onChange={value => {this.setState({valence:value})}}/>

  <h5> Tempo (Low to High)</h5>
  <Rating initialRating={this.state.tempo} start={0} stop={10} onChange={value => {this.setState({tempo:value})}}/>

  <h5> Loudness </h5>
  <Rating initialRating={this.state.loudness} start={0} stop={10} onChange={value => {this.setState({loudness:value})}}/>
  </div></div>
  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
  <div style={{ display: 'flex', justifyContent: 'center'}}><h5> Finish Quiz </h5></div>{/* put call to server here and put state chance to song thing there */}
  <div style={{ display: 'flex', justifyContent: 'center'}}><button onClick={() => {this.callGenerateSong()}}> Help Me Finish</button></div>
  </div>
</>)}


songpicker = () => {
  return(
    <>
      <Music url={this.state.song1play} image={this.state.pic1}></Music>
      <Music url={this.state.song2play} image={this.state.pic2}></Music>
      <Music url={this.state.song3play} image={this.state.pic3}></Music>
    </>
  )
}

  render() {
    return (
      <div style={{ display: "inline-block" }}>
      {this.state.isSure && this.sure()}
      {this.state.hasSongsToDisplay && this.songpicker()}
      </div>
    )}
}