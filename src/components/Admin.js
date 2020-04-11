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
      activeFunction: 2  // 1 = View/Edit User, 2 = Add New
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


  mySubmitHandler_UPDATE = (event) => {
    fetch('http://localhost:9000/adminAPI/update', {
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
  }


  mySubmitHandler_INSERT = (event) => {
    fetch('http://localhost:9000/adminAPI/insert', {
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

  mySQLHandler_DELETE = (myQuery, event) => {
    fetch('http://localhost:9000/delete', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: myQuery})
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: JSON.stringify(msg)});
          console.log(msg);
        });
      });
  }

  myChangeHandler = (event) => {
    let name = event.target.name;
    let val = (name === 'isResearcher' || name === 'isReviewer' || name === 'isEditor') ? event.target.checked : event.target.value;
    this.setState({[name]: val});
    if (this.state.serverResponse !== "")
    this.setState({serverResponse: ""});
  }


  changeFunction = (goingTo, comingFrom, event) => {
    if (goingTo === comingFrom) {
      if (goingTo === 1)  this.setState({activeFunction: 11});
      else  this.setState({activeFunction: 22});
    }
    else
      this.setState({activeFunction: goingTo});
  }

  selectScreen = () => {
    if(this.state.activeFunction === 1) return <ViewEditUser {...this.state}/>
    if(this.state.activeFunction === 2) return <AddUser {...this.state}/>
    if(this.state.activeFunction === 11) return <IntermediateTrick {...this.state} dest="ViewEdit"/>
    if(this.state.activeFunction === 22) return <IntermediateTrick {...this.state} dest="Add"/>
  }


  render() {
    return (
      <div id="renderContainer">
        <div id="adminMenu" style={{textAlign: "right", margin: "120px 80px 0 0", float: "left", height: "100vh", width: "200px"}}>
          <button onClick={ (ev) => this.changeFunction(1, this.state.activeFunction, ev) }>View / Edit Users</button><br/><br/>
          <button onClick={ (ev) => this.changeFunction(2, this.state.activeFunction, ev) }>Add New User</button><br/><br/>
        </div>
        <div id="adminContainer" style={{float: "left", margin: "60px 0 0", width: "calc(100vw - 400px)"}}>
          <h1>Admin Control Panel</h1><br />
          {this.selectScreen()}
          {/* {this.state.activeFunction === 1 ? <ViewEditUser {...this.state}/> : <AddUser {...this.state}/>} */}
        </div>
      </div>
    );
  }

}




class ViewEditUser extends Admin {
  constructor(props) {
    super(props);
    this.queryNeeded = true;  // flag, used to keep track of when another db query is actually needed
    this.state = {
      ...this.props,
      activeScreen: 0, // 0 = selection, 1 = view/edit
      selectedUser: null
    };
  }


  performSelectQuery = (myQuery) => {
    if (this.queryNeeded) { 
      
      this.mySubmitHandler_SELECT(myQuery)  // inherited from Admin, just reusing its event handler
      this.queryNeeded = false;
    }
  }

  buttonHandler = (action, userIndex) =>{
    this.setState({selectedUser: userIndex});
    if (action === 'view') {
      this.setState({activeScreen: 1});
      return;
    }

    // delete user
    const query = "DELETE FROM  USERS  WHERE email=\"" + this.state.serverResponse[userIndex].email + "\"";
    this.mySQLHandler_DELETE(query);

    this.queryNeeded = true; // we want to query the DB again after the removal
    this.setState({serverResponse: this.state.serverResponse.splice(userIndex, 1)});
    console.log(this.state.serverResponse);
  }

  printUsers() {
    this.performSelectQuery("SELECT * FROM USERS");
    //if (this.state.serverResponse !== "") {
      let users = this.state.serverResponse;
      const size = users.length;
      let tableRows = [];

      for (let i = 0; i < size; i++) {
        tableRows.push(<tr key={"row"+i}><td> &nbsp; {users[i].fName} &nbsp; </td><td> &nbsp; {users[i].lName} &nbsp; </td><td> &nbsp; {users[i].email} &nbsp; </td>
                       <td> &nbsp; {<button onClick={() => this.buttonHandler('view', i)}>View/Edit User</button>} &nbsp; </td>
                       <td> &nbsp; {<button onClick={() => this.buttonHandler('del', i)}>Delete User</button>} &nbsp; </td></tr>);
      }
      return tableRows;
    //}
  }

  render() {
    return (
      <div>
        { this.state.activeScreen === 0 && 
        <div>
          <h4>View / Edit / Remove user:</h4><br /><br />
          <table border='1'>
            <tbody>
              <tr><td><strong> &nbsp; First Name  &nbsp; </strong></td><td><strong> &nbsp; Last Name &nbsp; </strong></td><td><strong> &nbsp; email &nbsp; </strong></td>
              <td><strong> &nbsp; view/edit? &nbsp; </strong></td><td><strong> &nbsp; delete? &nbsp; </strong></td></tr>
              {this.printUsers()}
            </tbody>
          </table>
        </div> }
        
        { this.state.activeScreen > 0 &&
          <div>
            <EditUser userInfo={this.state.serverResponse[this.state.selectedUser]}/>
          </div>
        }

      </div>
    );
  }
}







class EditUser extends ViewEditUser {
  constructor(props) {
    super(props);
    this.state = {
      originalEmail: this.props.userInfo.email, // Primary key, so need to keep track in case it is changed

      email: this.props.userInfo.email,
      password: this.props.userInfo.password,
      fName: this.props.userInfo.fName,
      lName: this.props.userInfo.lName,
      isResearcher: this.props.userInfo.isResearcher, 
      isReviewer: this.props.userInfo.isReviewer, 
      isEditor: this.props.userInfo.isEditor, 
      serverResponse: ""
    };
  }

  delThisUser = () => {
    this.mySQLHandler_DELETE("DELETE FROM  USERS  WHERE email=\"" + this.state.email + "\"");
    this.resetState();
    this.activeScreen = 1;
    return <IntermediateTrick {...this.state} dest="ViewEdit"/>
  }

  printResponse() {
    if (this.state.serverResponse === "\"Entry removed from table\"")
      return "User removed from system";
    else if (this.state.serverResponse === "\"User updated\"")
      return "User updated in system";
    return "";
  }

  render() {
    return (
      <div>
        <h4>Viewing: &nbsp;{this.props.userInfo.fName} {this.props.userInfo.lName}</h4> <br />

        <form onSubmit={this.mySubmitHandler_UPDATE}>
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

          <input type='submit' value="Update this user" />
        </form>

        <br/>
        <button onClick={() => this.delThisUser()}>Delete User</button>

        <div id="statusMsg">
          <div style={{padding: "0 0 15px"}}>
            <div id="updateMsg" style={{padding: "50px 0 15px"}}>
              <strong>{this.printResponse()}</strong>
            </div>
          </div>
        </div>

      </div>
      
    );
  }
}





class AddUser extends Admin {
  constructor(props)  {
    super(props);
    this.state = {...this.state};
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

          <input type='submit' value="Add user to system" />
        </form>

        <div id="statusMsg">
          <div style={{padding: "0 0 15px"}}>
            <div id="addMsg" style={{padding: "50px 0 15px"}}>
              <strong>{this.state.serverResponse === "" ? "" : "User added to system"}</strong>
            </div>
          </div>
        </div>

        {/* <div id="debugDisplay">
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
          </div> */}

      </div>
    );
  }
}






// quick & dirty workaround for an annoying issue
// forces refresh of parent component when viewing child
class IntermediateTrick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
    };
  }
  render() {return (<div>{this.props.dest === "ViewEdit" ? <ViewEditUser {...this.state}/> : <AddUser {...this.state}/>}</div>);}
}




export default Admin;