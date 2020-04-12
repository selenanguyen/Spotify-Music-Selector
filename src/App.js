import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      greeting: ''

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

  getSongs() {
    // fetch(`/api/getSongs`)
    // .then(response => response.json())
    // .then(jsonresponse => console.log("RECEIVED IN CLIENT:", jsonresponse));
  }

  render() {
    return (
      <div id="login">
        <h1>This is an example of the Authorization Code flow</h1>
        <a href="http://localhost:3001/login" class="btn btn-primary">Log in with Spotify</a>
      </div>


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
    );
  }
}

export default App;