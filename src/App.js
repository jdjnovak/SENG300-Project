import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import './App.css';
import Home from './components/Home.js';
import Upload from './components/Upload.js';
import NotFound from './components/NotFound.js';
import LoginWindow from './components/Login.js';
import Admin from './components/Admin.js';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';

function App() {
    return (
        <div className="App">
          <Navbar bg="light" variant="light" expand="lg">
            <Navbar.Brand href="/">
              <Image
                src={require('./assets/uw-logo-black-text.png')}
                height={60}
                alt="University of Winnipeg Logo"
              />
            </Navbar.Brand>
			<br/>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
              <Nav.Link href="/admin">Admin</Nav.Link>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/upload">Upload</Nav.Link>
              </Nav>
            </Navbar.Collapse>

            <LoginWindow />

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
        </div>
    );
}

export default App;
