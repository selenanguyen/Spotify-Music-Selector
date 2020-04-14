import React, { Component } from 'react';
import { UserView } from "./UserView.js";
import './App.css';
import { QuizView } from "./QuizView.js";

class DatabaseLoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'root',
      password: '',
      errorMsg: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }
  handleSubmit() {
    const onDatabaseLoginSuccess = this.props.onDatabaseLoginSuccess;
    const setState = this.setState.bind(this);
    fetch(`/api/databaseLogin?usr=${encodeURIComponent(this.state.username)}&pw=${encodeURIComponent(this.state.password)}`)
    .then(r => {
      return r.json()
    }).then(r => {
      if (r.success) {
        this.props.onDatabaseLoginSuccess();
      }
      else {
        setState({
          errorMsg: r.message
        })
      }
    }).catch(e => {
      setState({
        errorMsg: "Invalid username or password"
      })
    })
  }

  updateUsername(usrn) {
    this.setState({
      username: usrn
    })
  }
  updatePassword(pw) {
    this.setState({
      password: pw
    })
  }
  render() {
    const labelStyle = {
      marginTop: '15px'
    }
    return (
    <span style={{
      display: 'flex',
      flexDirection: 'column'
    }}><h3>Log into the database using your credentials.</h3>
    {this.state.errorMsg && <label style={{color: 'red'}}>{this.state.errorMsg}</label>}
      <form style={{ textAlign: 'left'}}>
        <div><label style={labelStyle}>username: 
          <input type="text" value={this.state.username} onChange={(e) => this.updateUsername(e.target.value)} />
        </label></div>
        <div><label style={labelStyle} >password: 
          <input type="password" value={this.state.password} onChange={(e) => this.updatePassword(e.target.value)}/>
        </label></div>
      </form>
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row'}}>
        <button onClick={this.handleSubmit}>log in</button></div>
    </span>
    );
  }
}

class AnonymousView extends Component {
  constructor(props) {
    super(props);
  }

  renderQuiz() {
    console.log('rendering from anon')
    return <QuizView />;
  }

  render() {
    // return <div style={{ display: "inline-block" }}><h1>this is an anonymous user</h1>
    //   {this.renderQuiz()}</div>
    return this.renderQuiz()
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
        <div style={divStyle}><label>Log in with Spotify and we'll select from your own music library.<br />Or use anonymously and we'll select from our database of all kinds of music.</label></div>
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
        <button style={{
          ...buttonStyle,
          ...spotifyBlack
        }} onClick={() => this.props.login(true)}>Use anonymously</button></div>
        
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoggedIntoDatabase: false,
      isAnonymous: null
    };
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDatabaseLoginSuccess = this.onDatabaseLoginSuccess.bind(this);
    // if (this.getHashParams().token) {
    //   this.getSongs();
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isLoggedIn != nextState.isLoggedIn
      || this.state.isAnonymous != nextState.isAnonymous
      || this.state.isLoggedIntoDatabase != nextState.isLoggedIntoDatabase;
  }

  getHashParams = () => {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    //q = window.location.href.substring(window.location.origin.length + 2);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  onDatabaseLoginSuccess() {
    this.setState({
      ...this.state,
      isLoggedIntoDatabase: true
    })
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
      if (!this.state.isLoggedIntoDatabase) {
        return <DatabaseLoginView onDatabaseLoginSuccess={this.onDatabaseLoginSuccess} />
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