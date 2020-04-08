import React from 'react';


class Admin extends React.Component {  

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fName: '',
      lName: '',
      isResearcher: null,
      isReviewer: null,
      isEditor: null
    };
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
    alert("You are adding a new user to the database");

  }

  render() {
    return (
      <div id="adminContainer" style={{margin: "60px auto 0", width: "420px", height: "400px;"}}>
        <h1>Admin Control Pannel</h1><br />
        <h4>Add new user:</h4><br />

          <form onSubmit={this.mySubmitHandler}>
            <p>Email of user:</p>
            <input
              type='email'
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




          {/*A standard HTML form... apparently you can't quite do it like this...
            <form action="/node-admin-ops.js" method="get">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email"><br>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password"><br>

            <label for="fName">First name:</label><br>
            <input type="text" id="fName" name="fName"><br>

            <label for="lName">Last name:</label><br>
            <input type="text" id="lName" name="lName">

            <label for="isResearcher">User is a Researcher?</label><br>
            <input type="checkbox" id="isResearcher" name="isResearcher">

            <label for="isReviewer">User is a Reviewer?</label><br>
            <input type="checkbox" id="isReviewer" name="isReviewer">

            <label for="isEditor">User is a Editor?</label><br>
            <input type="checkbox" id="isEditor" name="isEditor">

            <input type="submit" value="Submit"/>
          </form>*/}

        <div id="adminDisplay">
          <br/>
          ...This is a work in progress. &nbsp; #dontJudgeMe<br/><br/>
          <strong>Current state of this container:</strong><br/>
          {this.state.email}<br/>
          {this.state.password}<br/>
          {this.state.fName}<br/>
          {this.state.lName}<br/>
          {this.state.isResearcher}<br/>
          {this.state.isReviewer}<br/>
          {this.state.isEditor}
        </div>

      </div>
    );
  }

}

export default Admin;