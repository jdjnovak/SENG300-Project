import React from 'react';
import { Progress } from 'semantic-ui-react' // see: https://react.semantic-ui.com/
import '../App.css'

// import from config file
import storage  from './Firebase/firebase.js'




class UploadTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // url: null,
      // fileobj: (null, but can't do this),
      // selected: false, 
      // uploading: false, 
      // progress: 0, 
      // done: false
      // ... seems I don't need to define these yet
      fileURL: "123",
      title: "",
      description: "",
      subDate: null, // gets calculated server-side, btw... might not need this
      author: "", // FIX: should use logged-in user's email, not this
      revParentID: null,
      revDeadline: null,
      status: "Awaiting editor review",

      nomitatedRev1: null,
      nomitatedRev2: null,
      nomitatedRev3: null,

      sideLabel: "",
      btnLabel: " Select file...",
      serverResponse: ""
    }

    this.queryNeeded = true;
  }


  handleChange = (e) => {
    if (e.target.files[0]) {
      const fileobj = e.target.files[0];
      this.setState(() => ({ fileobj, selected: true, sideLabel: fileobj.name, btnLabel: " File to submit: " }));
      // have the file name now...
    }
  }


  performSelectQuery = (myQuery) => {
    if (this.queryNeeded) { 
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

      this.queryNeeded = false;
    }
  }


  printReviewersAsOptions() {
    this.performSelectQuery("SELECT email, fName, lName FROM USERS WHERE isReviewer = true AND email <> '" 
                             + this.state.author + "'" );

    let users = this.state.serverResponse;
    const size = users.length;
    let optionRows = [];
    optionRows.push(<option key={"selectMsg"} value={'selectMsg'} disabled> &nbsp; &nbsp;- select reviewer -&nbsp; &nbsp; </option>);
    optionRows.push(<option key={"blankLine"} value={'blankLine'} disabled></option>);

    for (let i = 0; i < size; i++)
      optionRows.push(<option key={"val"+i} value={users[i].email}>{users[i].fName} {users[i].lName}</option>);

    return optionRows;
  }


  resetSubmission = () => {
    this.setState({fileURL : ""});
    this.setState({title : ""});
    this.setState({description : ""});
    this.setState({subDate : null});
    this.setState({author : ""}); // FIX: should use logged-in user's email, not this
    this.setState({revParentID : null});
    this.setState({revDeadline : null});
    this.setState({status : "Awaiting editor review"});

    this.setState({nomitatedRev1 : null});
    this.setState({nomitatedRev2 : null});
    this.setState({nomitatedRev3 : null});
    this.queryNeeded = true;
  }


  getDLurl = (fileName) => {
    storage
    .ref(`/submissions/` + fileName + `/`)
    // .child('inCaseYouLookinForSpecificFile')
    .getDownloadURL()
    .then((fileURL) => {
      this.setState({ fileURL })
      this.nowSendIt(); // fml. Took so long to figure out this solution (order is important with all this async crap).
    })
  }


  mySubmitHandler_INSERTsubmission = (event) => {

    // first upload file to Firebase storage
    this.setState({ uploading: true })
    const { fileobj } = this.state;
    const uploadTask = storage.ref(`/submissions/` + fileobj.name + `/`).put(fileobj);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = 
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({ progress });
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('200 OK');
        this.setState({fileURL: this.getDLurl(fileobj.name), done: true, uploading: false, success: true, sideLabel: "File uploaded" });
      }
    );

    event.preventDefault();
  }

  nowSendIt = () => {
    console.log("This is the URL right before sending it: \n" + this.state.fileURL + "\n\n");
    // submit everything to our db
    fetch('http://localhost:9000/insert-submission', {  // this will need to be parameterized in the API
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)  // convert the state to JSON and send it as the POST body 
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: JSON.stringify(msg)});
          console.log(msg);
        });
      });
    
    // and finally:
    this.resetSubmission(); 
  }


  myChangeHandler = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val});
    if (this.state.sideLabel === "File uploaded") {
      this.setState({sideLabel: ""});
      this.setState({success: false});
      this.setState({done: false});
    }
  }


  submissionForm = () => {
    return (
      <div className='submissionForm'>
        <br/>
          <form onSubmit={this.mySubmitHandler_INSERTsubmission}>
            <h5>Title of this work:</h5>
            <input
              type='text'
              name='title'
              value={this.state.title}
              maxLength = {200}
              onChange={this.myChangeHandler}
            /><br/><br/>

            <h5>Description:</h5>
            <textarea
              type='text'
              name='description'
              value={this.state.description}
              style={{height: '150px'}}
              maxLength = {500}
              onChange={this.myChangeHandler}
            /><br/><br/>
            
            <h5>Email you use to log into this system:</h5>
            <p>(FIX THIS SO IT JUST READ'S LOGGED-IN USER'S EMAIL)</p>
            <input
              type='email'
              name='author'
              value={this.state.author}
              maxLength = {50}
              style={{width: '300px'}}
              onChange={this.myChangeHandler}
            /><br/><br/>

            <div style={{margin: '10px 0'}}><h5>Nominate up to 3 reviewers to assess this work: &nbsp; (optional)</h5></div>
            <select
              type='email'
              name='nomitatedRev1'
              defaultValue='selectMsg'
              onChange={this.myChangeHandler}
            > 
            {this.printReviewersAsOptions()}
            </select>

            &nbsp; &nbsp; &nbsp;

            <select
              type='email'
              name='nomitatedRev2'
              defaultValue='selectMsg'
              onChange={this.myChangeHandler}
            > 
            {this.printReviewersAsOptions()}
            </select>

            &nbsp; &nbsp; &nbsp;

            <select
              type='email'
              name='nomitatedRev2'
              defaultValue='selectMsg'
              onChange={this.myChangeHandler}
            > 
            {this.printReviewersAsOptions()}
            </select>

            <br/><br/><br/>
            <input type='submit' value="Submit article" />
          </form>
      </div>
    );
  }


  render() {
    let { success, uploading, progress } = this.state;
    return(
      <div style={{margin: '0 auto', width: '700px'}}>
        <div className='slavediv'>
          <br/><br/>
          <h3>Submit a research article:</h3>
          <br/><br/>
          <h5>File:</h5>
            <div style={{padding: '7px 0 10px', height: '80px'}}>
              <input
                accept='.pdf'
                id='myfileinput'
                className='inputfile'
                type='file'
                onChange={this.handleChange}
              />
              <label htmlFor='myfileinput'><i className='ui upload icon' />{this.state.btnLabel}</label>
              
              {!success && <div style={{display: 'inline', paddingLeft: '20px', textDecoration: 'underline'}}>{this.state.sideLabel}</div>}
              {success && <div style={{display: 'inline', paddingLeft: '20px'}}>{this.state.sideLabel}</div>}
              {uploading && <Progress percent={progress} color='green' size='large' />}
            </div>

          {this.submissionForm()}
          <br/><br/>
          {success && <div style={{textAlign: 'center'}}><h5>Article submitted</h5></div>}
            <br/><br/>
        </div>
      </div>
    );
  }

}


export default UploadTest;