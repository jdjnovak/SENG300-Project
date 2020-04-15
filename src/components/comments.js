import React  from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../App.css';


function setUserEmail (email) { // using a static variable make this like a 1-time door
  if ( typeof setUserEmail.ue == 'undefined' ) {
    setUserEmail.ue = email;
  }
  return setUserEmail.ue;
}


class Review extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      subID: String(window.location).split('=')[1],
      reviewerID: setUserEmail(props.userEmail),
      deadline: '',
      recommendation: '',
      comments: '',
      serverResponse: "",
      activeFunction: 2,

      articleTitle: null,
      subInATable: null,
      requestToReview: null,
      shouldRun: true,

      clicked: false,
      requestBtnResponse: "",

      showRevBox: null,
      runThisOrNot: true,

      showRemoveReqBtn: null,
      runThisThing: true // terrible names, I know. No time rn.
    };
  }


reviewBoxGate = (subID, reviewerID) => { // the in-class version of a 1-time door
    if (this.state.runThisOrNot) {
      let myQuery = "SELECT * FROM REVIEWS WHERE subID = " + subID + " AND reviewerID = '" + reviewerID + "'";
  
      fetch('http://localhost:9000/select', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: myQuery})
      }).then(response => {
          response.json().then(data => {
            this.setState({showRevBox: data.length > 0, runThisOrNot: false});
          });
        });
    }
  }


  removalRequestBtnGate = (subID, reviewerID) => { // the in-class version of a 1-time door
    if (this.state.runThisThing) {
      let myQuery = "SELECT * FROM SUBMISSION WHERE subID = " + subID + " AND author = '" + reviewerID + "'";
  
      fetch('http://localhost:9000/select', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: myQuery})
      }).then(response => {
          response.json().then(data => {
            this.setState({showRemoveReqBtn: data.length > 0, runThisThing: false});
          });
        });
    }
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
    
    if (this.state.serverResponse !== "" || this.state.requestBtnResponse !== "") {
      this.setState({serverResponse: "", clicked: false, requestBtnResponse: ""});
      alert("FIRE!");
    }
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



  getSubmissionDeets = () => {
    if (this.state.shouldRun) {  // protects against inf. loop

      let myQuery = "SELECT * FROM SUBMISSION S, TOPICS T WHERE S.subID = " + this.state.subID + " AND S.subID = T.subID";
      //let myQuery = "SELECT S.subID, S.title, S.description, S.status, S.fileURL, T.subID AS TopicID," +
                    //"T.topic FROM SUBMISSION S LEFT JOIN TOPICS T ON S.subID = T.subID";
  
      fetch('http://localhost:9000/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: myQuery })
      }).then(response => {
        response.json().then(data => {
          let subInfo = JSON.parse(JSON.stringify(data));
          console.log(data);

          let subTable = (
            <div className='list-submissions'>
            <Container className='container-override'>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Research Title</th>
                    <th>Description</th>
                    <th>Topic</th>
                    <th>Status</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={"only1"}>
                    <td>{subInfo[0].title}</td>
                    <td style={{maxWidth: '450px'}}>{subInfo[0].description}</td>
                    <td>{subInfo[0].topic}{this.printTopics(subInfo)}</td>
                    <td>{subInfo[0].status}</td>
                    <td><a href={subInfo[0].fileURL}>download</a></td>
                  </tr>
                </tbody>
              </Table>
            </Container>
            </div>);

          this.setState({subInATable: subTable, articleTitle: subInfo[0].title, shouldRun: false});
        });
      });
    }
  }


  printTopics = (subInfo) => {
    let st = "";
    for (let i = 1; i < subInfo.length; i++)
      st += ", " + subInfo[i].topic;
    return st;
  }


  requestToReview = (event) => {
    // submit to the REQUESTS table
    // need user's email (I have it), and subID (I have it)

    // first, check to see if this person has already requested this or if the thing already has 4 reviewers
    const myQuery = "SELECT * FROM REQUESTS WHERE reviewerID = '" + this.state.reviewerID + 
                    "' AND subID = " + this.state.subID;
    fetch('http://localhost:9000/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: myQuery })
      }).then(response => {
        response.json().then(data => {
          let requests = JSON.parse(JSON.stringify(data));
          console.log("requests: " + data);
          if (requests.length === 0) {

            // good: this user hasn't requested this yet, 
            // but now check to see if there's already 4 assigned reviewers
            const myQuery = "SELECT * FROM REVIEWS WHERE subID = " + this.state.subID;
            fetch('http://localhost:9000/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: myQuery })
            }).then(response => {
              response.json().then(data => {
                let reviewers = JSON.parse(JSON.stringify(data));
                console.log("reviewers for this submission: " + data);
                if (reviewers.length < 4) {

                  //good, the request can be sent to the db
                  fetch('http://localhost:9000/insert-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
                    body: JSON.stringify({ subID: this.state.subID, reviewerID: this.state.reviewerID })
                  }).then(response => {
                    response.text().then(msg => {
                      this.setState({serverResponse: JSON.stringify(msg), clicked: true, 
                                     requestBtnResponse: "Request submitted. The editor will review your request shortly."});
                      console.log("insert-requests server response: " + msg);                
                    });
                  });
                } else  this.setState({requestBtnResponse: "Request denied: maximum number of reviewers already assigned.",
                                       clicked: true});
              });
            });
          } else  this.setState({requestBtnResponse: "You have already requested to review this article. Please be patient.",
                                 clicked: true});
        });
      });
  }



  changeSubStatusToReqRemoval = (env) => {
      const myQuery = "UPDATE SUBMISSION  SET status = 'Author requests removal' WHERE subID = " + this.state.subID;
      fetch('http://localhost:9000/update-submission', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: myQuery})  // convert the state to JSON and send it as the POST body 
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: JSON.stringify(msg)});
          console.log("Result of UPDATE query on SUBMISSION: " + msg);
        });
      });
  }



  render() {
    return (
      <div id="renderContainer">
        { this.reviewBoxGate(this.state.subID, this.state.reviewerID) }
        { this.removalRequestBtnGate(this.state.subID, this.state.reviewerID) }

        { this.state.showRevBox && 
          <div id="Review Submission Form" style={{textAlign: "right", margin: "120px 80px 0 0", float: "left", height: "100%", width: "200px"}}>
            <button onClick={ (ev) => this.changeFunction(1, this.state.activeFunction, ev) }>View / Edit Reviews</button><br/><br/>
            <button onClick={ (ev) => this.changeFunction(2, this.state.activeFunction, ev) }>Add New Review</button><br/><br/>
          </div> }

        { ! this.state.showRevBox &&
          <div id="placeholder" style={{textAlign: "right", margin: "120px 80px 0 0", float: "left", height: "100%", width: "200px"}}> &nbsp; </div>
        }

        <div id="ReviewForm" style={{float: "left", margin: "60px 0 0", width: "calc(100vw - 400px)"}}>
          <h1>Viewing: &nbsp; {this.state.articleTitle}</h1>
          <br/>
          {this.getSubmissionDeets()}
          {this.state.subInATable}
          <br/><br/>
          <button onClick={ (ev) => this.requestToReview(ev) }>Request to review this article</button>
          &nbsp; &nbsp; &nbsp; <strong>{ this.state.clicked && this.state.requestBtnResponse }</strong>
          <br/><br/>
          <br/><br/>

          {/* determines whether to show the review box: */}
          { this.state.showRevBox && 
            <div>
              <h2>Review this article: (don't show this section if user hasn't been assigned to review it)</h2>
              <br/>
              {this.selectScreen()} 
            </div> }

          { this.state.showRemoveReqBtn &&
            <div>
              <h4>As the author of this submission, you can request its removal from the system</h4>
              <br/>
              <button onClick={ (ev) => this.changeSubStatusToReqRemoval(ev) }>Request Removal</button><br/><br/>
            </div> }
            
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
      selectedReview: null,
      title: null,

      queryAgain: true
    };
    this.getSubTitle(this.props.subID);
  }

  getSubTitle = () => {
    const myQuery = "SELECT title FROM SUBMISSION WHERE subID = " + this.state.subID;
    fetch('http://localhost:9000/select', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: myQuery})
    }).then(response => {
        response.json().then(data => {
          this.setState({title: JSON.parse(JSON.stringify(data))[0].title});
          console.log(data);
        });
      });
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
    this.performSelectQuery("SELECT * FROM REVIEWS R, SUBMISSION S WHERE R.subID = S.subID");
      let reviews = this.state.serverResponse;
      const size = reviews.length;
      let tableRows = [];

      for (let i = 0; i < size; i++) {
        console.log("RIGHT HERE " + reviews.comment);
        tableRows.push(<tr key={"row"+i}><td style={{maxWidth: '120px'}}> &nbsp; <a href={
                       'comments?subID=' + reviews[i].subID}>{reviews[i].title}</a> &nbsp; </td><td> &nbsp; {reviews[i].reviewerID} &nbsp; </td><td> &nbsp; {reviews[i].deadline} &nbsp; </td><td> &nbsp; {reviews[i].recommendation} &nbsp; </td>
                       <td style={{maxWidth: '160px'}}> &nbsp; {reviews[i].comment} &nbsp; </td>
                       {/* <td> &nbsp; {<button onClick={() => this.buttonHandler('view', i)}>View/Edit Review</button>} &nbsp; </td> */}
                       {/* <td> &nbsp; {<button onClick={() => this.buttonHandler('del', i)}>Delete Review</button>} &nbsp; </td> */}
                       </tr>);
      }
      return tableRows;

  }

  render() {
    return (
      <div>
        { this.state.activeScreen === 0 &&
        <div className='reviewTable'>
          <h4>View / Edit / Remove review:</h4><br /><br />
          <table border='1' style={{width: '100%'}}>
            <tbody>
              <tr>
                <td><strong> &nbsp; Submission</strong></td>
                <td><strong> &nbsp; Reviewer</strong></td>
                <td><strong> &nbsp; Deadline</strong></td>
                <td><strong> &nbsp; Recommendation</strong></td>
                <td><strong> &nbsp; Comments</strong></td>
                {/* <td><strong> &nbsp; view/edit? &nbsp; </strong></td> */}
                {/* <td><strong> &nbsp; Delete? &nbsp; </strong></td> */}
              </tr>
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
      <div className='submissionForm'>
        <h4>Viewing: &nbsp;{this.props.reviewInfo.subID}</h4> <br />

        <form onSubmit={this.mySubmitHandler_UPDATE}>
		  
          <p>Reviewing as:</p>
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
      <div className='submissionForm' style={{width: '700px'}}>

          <p style={{paddingBottom: '10px'}}><strong>My deadline for submitting this review is: &nbsp; (deadline goes here)</strong></p>
          {this.state.deadline}

        <form onSubmit={this.mySubmitHandler_INSERT}>
        
          <p>Reviewing as:</p>
          <input
            type='text'
            name='reviewerID'
            style={{width: '300px'}}
            maxLength={50}
            value={this.state.reviewerID}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <p>Your recommendation:</p>
          <select value={this.state.recommendation} onChange={this.myChangeHandler} name='recommendation'>
            <option value="" disabled> &nbsp; select one </option>
            <option value="Major Review">Major Review</option>
            <option value="Minor Review">Minor Review</option>
            <option value="Accept">Accept</option>
          </select><br/><br/>

          <p>Comments for the author:</p>
          <textarea
            type='text'
            name='comments'
            style={{ height: '150px'}}
            maxLength={500}
            value={this.state.comments}
            onChange={this.myChangeHandler}
          /><br/><br/>

          <input type='submit' value="Submit Review" />
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
