import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CommentsTable from '../components/CommentsTable.js';
import commentsJson from '../data/test_data.json';
import ListSubs from './ListSubs.js';


function GetLastSubmitDate() {
    return "January 28, 2020";
}

function GetJournalStatus() {
    //var statuses = [ "Accepted", "Rejected", "Requires Minor Revision", "Requires Major Revision" ];
    //return statuses[Math.floor(Math.random() * 4)];
    let json = JSON.parse(JSON.stringify(commentsJson));
    let status = "Rejected"; // Default value

    let accepted_count = 0; // How many reviewers accepted the journal
    let rejected_count = 0; // How many reviewers rejected the journal
    let major_count = 0; // How many reviewers requested major edits

    for (let i = 0; i < json.comments.length; i++) {
        let decision = json.comments[i].decision;
        if (decision === "Accepted") {
            accepted_count++;
        } else if (decision === "Rejected") {
            rejected_count++;
        } else if (decision === "Major Revision Required") {
            major_count++;
        }
    }

    if (accepted_count === json.comments.length) status = "Accepted";
    else if (rejected_count === json.comments.length) status = "Rejected";
    else if (major_count !== 0) status = "Requires Major Revision";
    else status = "Requires Minor Revision";
    return status;
}

function Home() {
	return (
      <div id="outer-container">
        <div id="submission-summary" className="pt-5">
          <h1 className="text-center">Review your submissions</h1>
          <Container>
            <Row>
              <Container>
                <Row>
                  <Col className="text-right">Last submitted paper:</Col>
                  <Col>{GetLastSubmitDate()}</Col>
                </Row>
                <Row>
                  <Col className="text-right">Status:</Col>
                  <Col>{GetJournalStatus()}</Col>
                </Row>
                <br/>
                <h3 className="pt-5, text-center">Comments</h3>
                <CommentsTable />
              </Container>
            </Row>
          </Container>
        </div>


        <div style={{margin: '120px auto 30px', textAlign: 'center'}}><h2>Viewing All Research Submissions</h2></div>
        <ListSubs />
        
        <br/><br/><br/><br/>

      </div>
	);
}

export default Home;
