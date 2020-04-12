import React, { Component } from 'react';
import { UserView } from "./UserView.js";
import './App.css';
import { QuizComponent } from "./QuizComponent.js";

class AnonymousView extends Component {
  constructor(props) {
    super(props);
  }

  renderQuiz() {
    return <QuizComponent />;
  }

  render() {
    return <><h1>this is an anonymous user</h1>
      {this.renderQuiz()}</>
  }
}

class LoginView extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const buttonStyle = {
      color: 'white',
      border: 'none',
      margin: '15px',
      borderRadius: '5px',
      padding: '15px 32px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px'
    }
    const spotifyGreen = {
      backgroundColor: '#1DB954'
    }
    const spotifyBlack = {
      backgroundColor: '#191414'
    }
    const divStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      textAlign: 'center',
      alignItems: 'center'
    }
    return (
      <div>
        <div style={divStyle}><h1>Spotify Music Selector</h1></div>
        <div style={divStyle}><h3>We'll pick a song or curate a playlist for you based on how you're feeling.</h3></div>
        <div style={divStyle}><label>Log in with Spotify and we'll select from your own music library. Or use anonymously and we'll select from our database of all kinds of music.</label></div>
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px',
          flexDirection: 'row'
        }}><a href="http://localhost:3001/login" style={{
          ...buttonStyle, ...spotifyGreen
        }} onClick={() => this.props.login(false)}>Log in with Spotify</a>
        <a href="http://localhost:3000/#login=true" style={{
          ...buttonStyle,
          ...spotifyBlack
        }} onClick={() => this.props.login(true)}>Use anonymously</a></div>
        
      </div>
    )
  }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isAnonymous: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // if (this.getHashParams().token) {
    //   this.getSongs();
    // }
  }

  getHashParams = () => {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    //q = window.location.href.substring(window.location.origin.length + 2);
    console.log("url", window.location.origin, "q: " + q);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    console.log("hash params: ", hashParams);
    return hashParams;
  }


  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
      .then(response => response.json())
      .then(state => this.setState(state));
  }

  login(isAnonymous) {
    this.setState({
      isLoggedIn: true,
      isAnonymous: isAnonymous
    })
  }

  getSongs() {
    // fetch(`/api/getSongs`)
    // .then(response => response.json())
    // .then(jsonresponse => console.log("RECEIVED IN CLIENT:", jsonresponse));
  }

  render() {
    const getComponent = () => {
      if (this.getHashParams().token) {
        return <UserView />
      }
      if (this.state.isAnonymous) {
        return <AnonymousView />
      }
      return <LoginView login={this.login.bind(this)} />
    }
    return (
      <div style={{
        height: '100%',
        marginTop: "30px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>{getComponent()}</div>
    )


      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <form onSubmit={this.handleSubmit}>
      //       <label htmlFor="name">Enter your name: </label>
      //       <input
      //         id="name"
      //         type="text"
      //         value={this.state.name}
      //         onChange={this.handleChange}
      //       />
      //       <button type="submit">Submit</button>
      //     </form>
      //     <p>{this.state.greeting}</p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
  }
}

export default App;