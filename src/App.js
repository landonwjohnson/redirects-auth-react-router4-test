import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';


const fakeAuth = {
  isAuthenticated: false,
  authenticate(callback) {
    this.isAuthenticated = true
    setTimeout(callback, 100) // fake async
  }, 
  signout(callback) {
    this.isAuthenticated = false
    setTimeout(callback, 100)
  }
}

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { redirectToReferrer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/'} }

    if(redirectToReferrer === true){
      return <Redirect to={from} />
    }
    return (
      <div>
        <p>You must log in to view this page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>

      </div>
    )
  }
}

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
    ? <Component {...props} />
    : <Redirect to={{
        pathname: '/login',
        state: {from: props.location}
    }} />
  )}/>
)

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <ul>
              <li><Link to='/public'> Public </Link></li>
              <li><Link to='/protected'> Protected </Link> </li>
            </ul>
              <Route path="/public" component={Public} />
              <Route path="/login" component={Login} />
              <PrivateRoute path = '/protected' component={Protected} />
          </div>
        </Router>
    );
  }
}

export default App;
