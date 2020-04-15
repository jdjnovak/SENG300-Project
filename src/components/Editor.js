import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react'; // see: https://react.semantic-ui.com/
import '../App.css';

// import from config file
import storage from './Firebase/firebase.js';


class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {

      fileURL: "123",
      title: "",
      editorID: "",
	  journalID:"",
	  pubDate:null,

      status: "Published",

      sideLabel: "",
      btnLabel: " Select file...",
      serverResponse: ""
    };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: myQuery })
      }).then(response => {
        response.json().then(data => {
          this.setState({ serverResponse: JSON.parse(JSON.stringify(data)) });
          console.log("Here's the raw server response: \n");
          console.log(data);
        });
      });

      this.queryNeeded = false;
    }
  }


  resetSubmission = () => {
	this.setState({ journalID: "" });
    this.setState({ fileURL: "" });
    this.setState({ title: "" });
    this.setState({ pubDate: null });
	this.setState({ editorID: "" });
    this.setState({ status: "Published" });


    this.queryNeeded = true;
  }


  getDLurl = (fileName) => {
    storage
      .ref(`/submissions/` + fileName + `/`)
      // .child('inCaseYouLookinForSpecificFile')
      .getDownloadURL()
      .then((fileURL) => {
        this.setState({ fileURL });
        this.nowSendItToDB(); // fml. Took so long to figure out this solution (order is important with all this async crap).
      });
  }


  escapeString = st => {
    let escapedSt = "";
    const length = st.length;
    for (let i = 0 ; i < length; i++) {
      if (st[i] === "'")
        escapedSt += "\\'";
      else if (st[i] === '"')
        escapedSt += '\\"';
      else 
        escapedSt += st[i];
    }
    return escapedSt;
  }


  mySubmitHandler_INSERTsubmission = (event) => {

    // first upload file to Firebase storage
    this.setState({ uploading: true });
    const { fileobj } = this.state;
    const uploadTask = storage.ref(`/submissions/` + fileobj.name + `/`).put(fileobj);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({ progress });
        //this.setState({description: this.escapeString(this.state.description)});
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('200 OK');
        this.setState({ fileURL: this.getDLurl(fileobj.name), done: true, uploading: false, success: true, sideLabel: "File uploaded" });
      }
    );
    event.preventDefault();
  }


  nowSendItToDB = () => {
    // have to chain some callbacks because this all happens asynchronously
    // and each successive piece depends on data from the previous piece,
    // so we need to make them wait before proceeding:

    // Start by storing the journal entry in our db
    fetch('http://localhost:9000/insert-journal', {  // this will need to be parameterized in the API
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)  // convert the state to JSON and send it as the POST body 
    }).then(response => {
        response.text().then(msg => {
          this.setState({serverResponse: JSON.stringify(msg)});
          console.log("Here's the insert-journal response: \n");
          console.log(msg);


        }); //insert-submission
      });
  }


  myChangeHandler = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({ [name]: val });
    if (this.state.sideLabel === "File uploaded") {
      this.setState({ sideLabel: "" });
      this.setState({ success: false });
      this.setState({ done: false });
    }
  }


  journalForm = () => {
    return (
      <div className='submissionForm'>
        <br />
        <form onSubmit={this.mySubmitHandler_INSERTsubmission}>
          <h5>Title of this work:</h5>
          <input
            type='text'
            name='title'
            value={this.state.title}
            maxLength={200}
            onChange={this.myChangeHandler}
          />

          <br />
          <br />

          <h5>editorID</h5>
          <input
            type='text'
            name='editorID'
            size = '100'
            value={this.state.editorID}
            onChange={this.myChangeHandler}
          /><br/><br/>

            <input type='submit' value="Submit work" />
        </form>
      </div>
    );
  }


  render() {
    let { success, uploading, progress } = this.state;
    return (
      <div style={{ margin: '0 auto', width: '700px' }}>
        <div className='slavediv'>
          <br /><br />
          <h3>Publish Journal:</h3>
          <br /><br />
          <h5>File:</h5>
          <div style={{ padding: '7px 0 10px', height: '80px' }}>
            <input
              accept='.pdf'
              id='myfileinput'
              className='inputfile'
              type='file'
              onChange={this.handleChange}
            />
            <label htmlFor='myfileinput'><i className='ui upload icon' />{this.state.btnLabel}</label>

            {!success && <div style={{ display: 'inline', paddingLeft: '20px', textDecoration: 'underline' }}>{this.state.sideLabel}</div>}
            {success && <div style={{ display: 'inline', paddingLeft: '20px' }}>{this.state.sideLabel}</div>}
            {uploading && <Progress percent={progress} color='green' size='large' />}
          </div>

          {this.journalForm()}

          <br />
          <br />

          {success && <div className="text-center"><h5>Article submitted</h5></div>}

          <br />
          <br />

        </div>
      </div>
    );
  }

}
 

export default Editor;