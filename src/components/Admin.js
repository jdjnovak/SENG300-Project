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
      isEditor: false
    };
  }



  callAPI = () => {  
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)  // convert the state to JSON and send it as the POST body    
    };
    fetch('http://localhost:9000/adminAPI', options)
      .then((response) => response.text())
      .then((responseTEXT) => {
        alert(responseTEXT);
      });
  }

  myChangeHandler = (event) => {
    let name = event.target.name;
    let val = (name === 'isResearcher' || name === 'isReviewer' || name === 'isEditor') ? event.target.checked : event.target.value;
    this.setState({[name]: val});
    // need to handle the checkboxes differently
  }

  mySubmitHandler = (event) => {
    this.callAPI();
  }



  render() {
    return (
      <div id="adminContainer" style={{margin: "60px auto 0", width: "420px"}}>
        <h1>Admin Control Panel</h1><br />
        <h4>Add new user:</h4><br />

          <form onSubmit={this.mySubmitHandler}> {/* <form id="new-user-form" method="POST" action="/api-admin"> */}
            <p>Email of user:</p>
            <input
              type='text'
              name='email'
              onChange={this.myChangeHandler}
            /><br/><br/>

            <p>Password for the user:</p>
            <input
              type='password'
              name='password'
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <p>First name of user:</p>
            <input
              type='text'
              name='fName'
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <p>Last name of user:</p>
            <input
              type='text'
              name='lName'
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <p>This user is a: &nbsp; (check all that apply)</p>
            <input
              type='checkbox'
              name='isResearcher'
              onChange={this.myChangeHandler}
            /> Researcher<br />

            <input
              type='checkbox'
              name='isReviewer'
              onChange={this.myChangeHandler}
            /> Reviewer<br />

            <input
              type='checkbox'
              name='isEditor'
              onChange={this.myChangeHandler}
            /> Editor <br/><br/><br/>

            <input type='submit' value="Add this user to system" />
          </form>


        <div id="debugDisplay">
          <div style={{padding: "50px 0 15px"}}><strong>container's current state: &nbsp;(DEBUG)</strong></div>
          {this.state.email}<br/>
          {this.state.password}<br/>
          {this.state.fName}<br/>
          {this.state.lName}<br/>
          {this.state.isResearcher ? "is a researcher" : ""}<br/>
          {this.state.isReviewer  ? "is a reviewer" : ""}<br/>
          {this.state.isEditor  ? "is an editor" : ""}<br/>
        </div>

      </div>
    );
  }

}

export default Admin;