import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

import { Auth0Context } from './contexts/auth0-context';
//import Auth from './components/Auth';

import Home from './components/Home.js';
import Upload from './components/Upload.js';
import NotFound from './components/NotFound.js';
import Admin from './components/Admin.js';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

//const auth = new Auth();
//const UserContext = React.createContext();

function App() {
  const { isLoading, user, loginWithRedirect, logout } = useContext(Auth0Context);

  return (
    <div className="App">
      {!isLoading && user && (
        <>
          <Navbar bg="light" variant="light" expand="lg">
            <Navbar.Brand href="/">
              <Image
                src={require('./assets/uw-logo-black-text.png')}
                height={60}
                alt="University of Winnipeg Logo"
              />
            </Navbar.Brand>
            <br />
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/admin">Admin</Nav.Link>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/upload">Upload</Nav.Link>
              </Nav>
            </Navbar.Collapse>

            <h4 id="currentUserEmail" className="pr-3">{user.email}</h4>
            <Button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="">
              Logout
            </Button>

          </Navbar>
          <Router>
            <div id="content-section">
              <Switch>
                <Route path="/admin" component={Admin} />
                <Route exact path="/" component={Home} />
                <Route path="/upload" component={Upload} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </Router>
        </>
      )
      }
      {
        !isLoading && !user && (
          <div className="h-50 w-100 text-center p-5">
            <Image
              src={require('./assets/uw-logo-black-text.png')}
              alt="University of Winnipeg Logo"
              fluid
            />
            <br />
            <br />
            <h1>Journal Submission Application</h1>
            <br />
            <br />
            <h4>Please log in to access the application.</h4>
            <Button onClick={loginWithRedirect} size="lg" className="ml-auto mr-auto">
              Login
          </Button>
          </div>
        )
      }
    </div >
  );
}

export default App;
