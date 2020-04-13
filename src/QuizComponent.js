import React, { Component } from 'react';
import Rating from 'react-rating';
import QuizPart2 from './quiz2.js';


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
      acousticnessWeight: 0,
      danceabilityWeight: 0,
      energyWeight: 0,
      instrumentalnessWeight: 0,
      loudnessWeight: 0,
      valenceWeight: 0,
      tempoWeight: 0,


      inputsAcc:[],

      songData:{},


      checked:false

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
    console.log("call generate song");
    if(this.state.isloading){
      console.log("loading")
      return
    }
    this.setState({isloading:true})
    console.log("set the state");
    fetch('http://localhost:3001/getRandomSong')
    .then((response) => {
      console.log("received fetch");
      return response.json();
    })
    .then((track) => {
      console.log("got data")
      let data = track.track
      console.log(data);
      this.setState({isloading:false,
        songData:data,
        hasSongsToDisplay: true,
        isSure:false,

    })
  })
}



  sure = () => {
    const columnStyle = {
      margin: '15px'
    }
    const rowStyle = {
      display: 'flex',
      flexDirection: 'column'
    }
    return(<>
  <h1> I know What I want (Only pick what you care about)</h1>
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
  <div style={columnStyle}>
  <div style={rowStyle}>
  <h5> Acousticness Level </h5>
  <Rating initialRating={this.state.acousticness} start={0} stop={10} onChange={value => {this.setState({acousticness:value})}}/>
  <h7> How important is acousticness to you? </h7>
  <Rating initialRating={this.state.acousticnessWeight} start={0} stop={10} onChange={value => {this.setState({acousticnessWeight:value})}}/>
  </div>
 
  <div style={rowStyle}>
  <h5> Dancability  </h5>
  <Rating initialRating={this.state.danceability} start={0} stop={10} onChange={value => {this.setState({danceability:value})}}/>
  <h7> How important is dancability to you? </h7>
  <Rating initialRating={this.state.danceabilityWeight} start={0} stop={10} onChange={value => {this.setState({danceabilityWeight:value})}}/>
  </div>

  <div style={rowStyle}>
  <h5> Energy Level </h5>
  <Rating initialRating={this.state.energy} start={0} stop={10} onChange={value => {this.setState({energy:value})}}/>
  <h7> How important is the energy level to you? </h7>
  <Rating initialRating={this.state.energyWeight} start={0} stop={10} onChange={value => {this.setState({energyWeight:value})}}/>
  </div>

  <div style={rowStyle}>
  <h5> Instrumentalness (less words)</h5>
  <Rating initialRating={this.state.instrumentalness} start={0} stop={10} onChange={value => {this.setState({instrumentalness:value})}}/>
  <h7> How important is the instrumentalness to you? </h7>
  <Rating initialRating={this.state.instrumentalnessWeight} start={0} stop={10} onChange={value => {this.setState({instrumentalnessWeight:value})}}/>
</div></div>


  <div style={columnStyle}>
  <div style={rowStyle}>
  <h5> Happiness Level </h5>
  <Rating initialRating={this.state.valence} start={0} stop={10} onChange={value => {this.setState({valence:value})}}/>
  <h7> How important is happiness level to you? </h7>
  <Rating initialRating={this.state.valenceWeight} start={0} stop={10} onChange={value => {this.setState({valenceWeight:value})}}/>
  </div>

  <div style={rowStyle}>
  <h5> Tempo (Low to High)</h5>
  <Rating initialRating={this.state.tempo} start={0} stop={10} onChange={value => {this.setState({tempo:value})}}/>
  <h7> How important is the tempo to you? </h7>
  <Rating initialRating={this.state.tempoWeight} start={0} stop={10} onChange={value => {this.setState({tempoWeight:value})}}/>
</div>

  <div style={rowStyle}>
  <h5> Loudness </h5>
  <Rating initialRating={this.state.loudness} start={0} stop={10} onChange={value => {this.setState({loudness:value})}}/>
  <h7> How important is the loudness to you? </h7>
  <Rating initialRating={this.state.loudnessWeight} start={0} stop={10} onChange={value => {this.setState({loudnessWeight:value})}}/>
  </div>

  </div></div>
  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
  <div style={{ display: 'flex', justifyContent: 'center'}}><h2> I Don't Know What I want! </h2></div>{/* put call to server here and put state chance to song thing there */}
  <div style={{ display: 'flex', justifyContent: 'center'}}><button onClick={() => {this.callGenerateSong()}}> Help Me Finish</button></div>
  </div>
</>)}




  render() {
    return (
      <div style={{ display: "inline-block" }}>
      {this.state.isSure && this.sure()}
      {this.state.hasSongsToDisplay && <QuizPart2 songData={this.state.songData}/>}
      </div>
    )}
}