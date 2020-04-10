import React from 'react';



class Admin extends React.Component { 

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fName: '',
      lName: '',
      isResearcher: false, 
      isReviewer: false, 
      isEditor: false,
      serverResponse: ""
    };
  }

  resetState = (inclServResponse) => {
    this.setState({email: ""});
    this.setState({password: ""});
    this.setState({fName: ""});
    this.setState({lName: ""});
    this.setState({isResearcher: false});
    this.setState({isReviewer: false});
    this.setState({isEditor: false});
    if (inclServResponse) this.setState({serverResponse: ""});
  }

  myChangeHandler = (event) => {
    let name = event.target.name;
    let val = (name === 'isResearcher' || name === 'isReviewer' || name === 'isEditor') ? event.target.checked : event.target.value;
    this.setState({[name]: val});
    // need to handle the checkboxes differently
  }

  mySubmitHandler_INSERT = (event) => {
    fetch('http://localhost:9000/adminAPI', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)  // convert the state to JSON and send it as the POST body 
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: msg});
          console.log(msg);
        });
      });

    event.preventDefault();
    this.resetState(false);
  }

  mySubmitHandler_SELECT = (myQuery, event) => {  // use this to perform SELECT query on our db
    fetch('http://localhost:9000/select', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: myQuery})   
    }).then(response => {
        response.json().then(data => {
          this.setState({serverResponse: data});  // doesn't seem to like this 
          this.dbData = data;
          console.log(data);
          console.log(this.dbData[0].fName);
        });
      });

    event.preventDefault();
    this.resetState(false);
  }


  render() {
    return (
      <div id="adminContainer" style={{margin: "60px auto 0", width: "420px"}}>
        <h1>Admin Control Panel</h1><br />
        <h4>Add new user:</h4><br />

          <form onSubmit={this.mySubmitHandler_INSERT}> {/* <form id="new-user-form" method="POST" action="/api-admin"> */}
            <p>Email of user:</p>
            <input
              type='email'
              name='email'
              value={this.state.email}
              onChange={this.myChangeHandler}
            /><br/><br/>

            <p>Password for the user:</p>
            <input
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <p>First name of user:</p>
            <input
              type='text'
              name='fName'
              value={this.state.fName}
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <p>Last name of user:</p>
            <input
              type='text'
              name='lName'
              value={this.state.lName}
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <p>This user is a: &nbsp; (check all that apply)</p>
            <input
              type='checkbox'
              name='isResearcher'
              checked={this.state.isResearcher}
              onChange={this.myChangeHandler}
            /> Researcher<br />

            <input
              type='checkbox'
              name='isReviewer'
              checked={this.state.isReviewer}
              onChange={this.myChangeHandler}
            /> Reviewer<br />

            <input
              type='checkbox'
              name='isEditor'
              checked={this.state.isEditor}
              onChange={this.myChangeHandler}
            /> Editor <br/><br/><br/>

            <input type='submit' value="Add this user to system" />
          </form>


        <div id="debugDisplay">
          <div style={{padding: "0 0 15px"}}>
            <div style={{padding: "50px 0 15px"}}>
              <strong>{this.state.serverResponse === "" ? "" : "Server response: (DEBUG)"}</strong>
            </div>
            {JSON.stringify(this.state.serverResponse)}<br/><br/><br/>
            <strong>container's current state: &nbsp;(DEBUG)</strong>
          </div>
          {this.state.email}<br/>
          {this.state.password}<br/>
          {this.state.fName}<br/>
          {this.state.lName}<br/>
          {this.state.isResearcher ? "is a researcher" : ""}<br/>
          {this.state.isReviewer  ? "is a reviewer" : ""}<br/>
          {this.state.isEditor  ? "is an editor" : ""}<br/><br/>
        </div>

        <div style={{padding: "0 0 100px"}}>
          <form onSubmit={ (event) => this.mySubmitHandler_SELECT("SELECT fName FROM USERS", event)}>
            <input type='submit' value="Test query" />
          </form>
        </div>

      </div>
    );
  }

}

export default Admin;