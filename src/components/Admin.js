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
      serverResponse: "",
      activeFunction: 1  // 0 = View/Edit User, 1 = Add New, 2 = Delete
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
          this.setState({serverResponse: JSON.stringify(msg)});
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
          this.setState({serverResponse: JSON.parse(JSON.stringify(data))});
          console.log(data);
        });
      });

    if (typeof event !== 'undefined') event.preventDefault();
    if (typeof event !== 'undefined')this.resetState(false);
  }


  showFunction = () => {
    switch(this.state.activeFunction) {
      case 0:
        return <ViewEditUser value={this.state}/>; 
      case 1:
        return <AddUser value={this.state}/>;
      default:
        return <ViewEditUser value={this.state}/>; 
    }
  }


  changeFunction = (func, event) => {
    this.setState({activeFunction: func})
  }


  render() {
    return (
      <div id="renderContainer">
        <div id="adminMenu" style={{textAlign: "right", margin: "120px 80px 0 0", float: "left", height: "100vh", width: "200px"}}>
          <button onClick={ (ev) => this.changeFunction(0, ev) }>View / Edit Users</button><br/><br/>
          <button onClick={ (ev) => this.changeFunction(1, ev) }>Add New User</button><br/><br/>
        </div>
        <div id="adminContainer" style={{float: "left", margin: "60px 0 0", width: "calc(100vw - 400px)"}}>
          <h1>Admin Control Panel</h1><br />
          
          {this.showFunction()}
          
        </div>
      </div>
    );
  }

}



class ViewEditUser extends Admin {
  constructor(props)  {
    super(props);
    this.state = props.value;
  }


  selectQuery = (myQuery) => {
    // static var prevents this func from infinite call looop (it refreshes the state AND is called in render())
    if (typeof this.selectQuery.hasRun == 'undefined' || !this.selectQuery.hasRun) { 
      this.selectQuery.hasRun = true;  // flag set (static var)
      this.mySubmitHandler_SELECT(myQuery)  // from Admin, just reusing the event handler
    }
  }

  componentWillUnmount() {
    this.selectQuery.hasRun = false;  // not needed, but just to make sure
  }

  printUsers() {
    this.selectQuery("SELECT fName, lName, email FROM USERS");
    if (this.state.serverResponse !== "") {
      let users = this.state.serverResponse;
      const size = users.length;
      let tableRows = [];

      for (let i = 0; i < size; i++) 
        tableRows.push(<tr key={"row"+i}><td> &nbsp; {users[i].fName} &nbsp; </td><td> &nbsp; {users[i].lName} &nbsp; </td><td> &nbsp; {users[i].email} &nbsp; </td></tr>);

      return tableRows;
    } 
  }


  render() {
    return(
      <div id="topLevelContainer0">
        <h4>View / Edit / Remove user:</h4><br /><br />
        <h5>Select a user: (work in progress)</h5><br/>
        <table border='1'>
          <tbody>
            <tr><td><strong> &nbsp; First Name  &nbsp; </strong></td><td><strong> &nbsp; Last Name &nbsp; </strong></td><td><strong> &nbsp; email &nbsp; </strong></td></tr>
            {this.printUsers()}
          </tbody>
        </table>


      </div> // #topLevelContainer0
    );
  }
}



class AddUser extends Admin {
  constructor(props)  {
    super(props);
    this.state = props.value;
  }

  render() {
    return(
      <div id="topLevelContainer1">
        <h4>Add new user:</h4><br />
        <form onSubmit={this.mySubmitHandler_INSERT}>
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
              {this.state.serverResponse}<br/><br/><br/>
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