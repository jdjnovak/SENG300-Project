import React from 'react';


class Review extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subID: String(window.location).split('=')[1],
      reviewerID: '',
      deadline: '',
      recommendation: '',
      comments: '',
      serverResponse: "",
      activeFunction: 2
    };
  }


  resetState = (inclServResponse) => {
	this.setState({subID: ""});
    this.setState({reviewerID: ""});
    this.setState({deadline: ""});
    this.setState({recommendation: ""});
    this.setState({comments: ""});
    if (inclServResponse) this.setState({serverResponse: ""});
  }


  mySubmitHandler_UPDATE = (event) => {
    fetch('http://localhost:9000/reviewAPI/update', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: JSON.stringify(msg)});
          console.log(msg);
        });
      });
    event.preventDefault();
  }


  mySubmitHandler_INSERT = (event) => {
    fetch('http://localhost:9000/reviewAPI/insert', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: JSON.stringify(msg)});
          console.log(msg);
        });
      });

    event.preventDefault();
    this.resetState(false);
  }


  mySubmitHandler_SELECT = (myQuery, event) => {
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
    let val = event.target.value;
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
    if(this.state.activeFunction === 1) return <ViewEditReview {...this.state}/>
    if(this.state.activeFunction === 2) return <AddReview {...this.state}/>
    if(this.state.activeFunction === 11) return <RefreshView {...this.state} dest="ViewEdit"/>
    if(this.state.activeFunction === 22) return <RefreshView {...this.state} dest="Add"/>
  }


  render() {
    return (
      <div id="renderContainer">
        <div id="Review Submission Form" style={{textAlign: "right", margin: "120px 80px 0 0", float: "left", height: "100vh", width: "200px"}}>
          <button onClick={ (ev) => this.changeFunction(1, this.state.activeFunction, ev) }>View / Edit Reviews</button><br/><br/>
          <button onClick={ (ev) => this.changeFunction(2, this.state.activeFunction, ev) }>Add New Review</button><br/><br/>
        </div>
        <div id="ReviewForm" style={{float: "left", margin: "60px 0 0", width: "calc(100vw - 400px)"}}>
          <h1>Review Submission Form</h1><br />
          {this.selectScreen()}
        </div>
      </div>
    );
  }

}




class ViewEditReview extends Review {
  constructor(props) {
    super(props);
    this.queryNeeded = true;
    this.state = {
      ...this.props,
      activeScreen: 0, // 0 = selection, 1 = view/edit
      selectedReview: null
    };
  }


  performSelectQuery = (myQuery) => {
    if (this.queryNeeded) {

      this.mySubmitHandler_SELECT(myQuery)
      this.queryNeeded = false;
    }
  }

  buttonHandler = (action, reviewIndex) =>{
    this.setState({selectedReview: reviewIndex});
    if (action === 'view') {
      this.setState({activeScreen: 1});
      return;
    }

    //DELETE fucntion to remove reviews from the database
    const query = "DELETE FROM REVIEWS  WHERE reviewerID=\"" + this.state.serverResponse[reviewIndex].reviewerID + "\"";
    this.mySQLHandler_DELETE(query);

    this.queryNeeded = true;
    this.setState({serverResponse: this.state.serverResponse.splice(reviewIndex, 1)});
    console.log(this.state.serverResponse);
  }

  printReviews() {
    this.performSelectQuery("SELECT * FROM REVIEWS");
      let reviews = this.state.serverResponse;
      const size = reviews.length;
      let tableRows = [];

      for (let i = 0; i < size; i++) {
        tableRows.push(<tr key={"row"+i}><td> &nbsp; {reviews[i].subID} &nbsp; </td><td> &nbsp; {reviews[i].reviewerID} &nbsp; </td><td> &nbsp; {reviews[i].deadline} &nbsp; </td><td> &nbsp; {reviews[i].recommendation} &nbsp; </td>
                       <td> &nbsp; {reviews[i].comments} &nbsp; </td>
                       <td> &nbsp; {<button onClick={() => this.buttonHandler('view', i)}>View/Edit Review</button>} &nbsp; </td>
                       <td> &nbsp; {<button onClick={() => this.buttonHandler('del', i)}>Delete Review</button>} &nbsp; </td></tr>);
      }
      return tableRows;

  }

  render() {
    return (
      <div>
        { this.state.activeScreen === 0 &&
        <div>
          <h4>View / Edit / Remove review:</h4><br /><br />
          <table border='1'>
            <tbody>
              <tr><td><strong> &nbsp; subID  &nbsp; </strong></td><td><strong> &nbsp; reviewerID  &nbsp; </strong></td><td><strong> &nbsp; deadline &nbsp; </strong></td><td><strong> &nbsp; recommendation &nbsp; </strong></td><td><strong> &nbsp; comments &nbsp; </strong></td>
              <td><strong> &nbsp; view/edit? &nbsp; </strong></td><td><strong> &nbsp; delete? &nbsp; </strong></td></tr>
              {this.printReviews()}
            </tbody>
          </table>
        </div> }

        { this.state.activeScreen > 0 &&
          <div>
            <EditReview reviewInfo={this.state.serverResponse[this.state.selectedReview]}/>
          </div>
        }

      </div>
    );
  }
}



class EditReview extends ViewEditReview {
  constructor(props) {
    super(props);
    this.state = {
      originalsubID: this.props.reviewInfo.subID,

      subID: this.props.reviewInfo.subID,
      reviewerID: this.props.reviewInfo.reviewerID,
      deadline: this.props.reviewInfo.deadline,
      recommendation: this.props.reviewInfo.recommendation,
      comments: this.props.reviewInfo.comments,
      serverResponse: ""
    };
  }

  delThisReview = () => {
    this.mySQLHandler_DELETE("DELETE FROM  REVIEWS  WHERE reviewerID=\"" + this.state.reviewerID + "\"");
    this.resetState();
    this.activeScreen = 1;
    return <RefreshView {...this.state} dest="ViewEdit"/>
  }

  printResponse() {
    if (this.state.serverResponse === "\"Entry removed from table\"")
      return "Review removed from system";
    else if (this.state.serverResponse === "\"Review updated\"")
      return "Review updated in system";
    return "";
  }

  render() {
    return (
      <div>
        <h4>Viewing: &nbsp;{this.props.reviewInfo.subID}</h4> <br />

        <form onSubmit={this.mySubmitHandler_UPDATE}>
		  <p>SubmissionID:</p>
		  <input
			type='text'
			name='subID'
			value={this.state.subID}
			onChange={this.myChangeHandler}
		  /><br/><br/>
		  
          <p>ReviewerID:</p>
          <input
            type='text'
            name='reviewerID'
            value={this.state.reviewerID}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>revised journal deadline: (in form "YYYY-MM-DD")</p>
          <input
            type='datetime-local'
            name='deadline'
            value={this.state.deadline}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>Reviewer recommends (needs Major Review, Minor Review, Accepted):</p>
          <input
            type='text'
            name='recommendation'
            value={this.state.recommendation}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>Comments</p>
          <input
            type='text'
            name='comments'
            size = '100'
            value={this.state.comments}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <input type='submit' value="Update this Review" />
        </form>

        <br/>
        <button onClick={() => this.delThisReview()}>Delete Review</button>

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





class AddReview extends Review {
  constructor(props)  {
    super(props);
    this.state = {...this.state};
  }

  render() {
    return(
      <div id="topLevelContainer1">
        <h4>Add new Review:</h4><br />
        <form onSubmit={this.mySubmitHandler_INSERT}>
		
		  <p>SubmissionID:</p>
		  <input
			type='text'
			name='subID'
			value={this.state.subID}
			onChange={this.myChangeHandler}
		  /><br/><br/>
			
          <p>ReviewerID:</p>
          <input
            type='text'
            name='reviewerID'
            value={this.state.reviewerID}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>revised journal deadline: (in form "YYYY-MM-DD")</p>
          <input
            type='date'
            name='deadline'
            value={this.state.deadline}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>Reviewer recommends (needs Major Review, Minor Review, Accepted):</p>
          <input
            type='text'
            name='recommendation'
            value={this.state.recommendation}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>Comments:</p>
          <input
            type='text'
            name='comments'
            size = '100'
            value={this.state.comments}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <input type='submit' value="Add Review to system" />
        </form>

        <div id="statusMsg">
          <div style={{padding: "0 0 15px"}}>
            <div id="addMsg" style={{padding: "50px 0 15px"}}>
              <strong>{this.state.serverResponse === "" ? "" : "Review added to system"}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


class RefreshView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
    };
  }
  render() {return (<div>{this.props.dest === "ViewEdit" ? <ViewEditReview {...this.state}/> : <AddReview {...this.state}/>}</div>);}
}




export default Review;
