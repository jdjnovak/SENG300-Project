import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import './App.css';
import Home from './components/Home.js';
import About from './components/About.js';
import Topics from './components/Topics.js';
import NotFound from './components/NotFound.js';
import LoginWindow from './components/Login.js';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';

function App() {
    return (
        <div className="App">
          <Navbar bg="light" variant="dark" expand="lg">
            <Navbar.Brand href="/">
              <Image
                src={require('./assets/uw-logo-black-text.png')}
                height={60}
                alt="University of Winnipeg Logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/about">Link</Nav.Link>
                <Nav.Link href="/topics">Topics</Nav.Link>
              </Nav>
            </Navbar.Collapse>

            <LoginWindow />

          </Navbar>
          <Router>
			<div id="content-section">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/topics" component={Topics} />
                <Route component={NotFound} />
              </Switch>
			</div>
          </Router>
        </div>
    );
}

export default App;
