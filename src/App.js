import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

import { Auth0Context } from './contexts/auth0-context';

import Home from './components/Home.js';
import Upload from './components/Upload.js';
import NotFound from './components/NotFound.js';
import Admin from './components/Admin.js';
import Comments from './components/comments.js';
import ListSubs from './components/ListSubs.js';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';


function App() {
  const { isLoading, user, loginWithRedirect, logout } = useContext(Auth0Context);

  return (
    <div className="App">
      {!isLoading && user && (
        <>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">
              <Image
                src={require('./assets/uw-logo-white-text.png')}
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
				        <Nav.Link href="/comments">Comments</Nav.Link>
              </Nav>
            </Navbar.Collapse>

            <div style={{margin: '2px 20px 0 0'}}><h5 id="currentUserEmail" className="pr-3 text-light">{user.email}</h5></div>
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
                <Route path="/listsubs" component={ListSubs} />
                <Route exact path="/" component={(props) => <Home {...props} userEmail={user.email} />} />
                <Route path="/upload" component={(props) => <Upload {...props} userEmail={user.email} />} />
				        <Route path ="/comments" component={(props) => <Comments {...props} userEmail={user.email} />}/>
                <Route component={NotFound} />
              </Switch>
            </div>
          </Router>
        </>
      )
      }
      {
        !isLoading && !user && (
          <div className="h-100 w-100 text-center p-5">
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
