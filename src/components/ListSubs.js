import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import '../App.css';


class ListSubs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableRows: null,
      subID: null
    };
    this.shouldRun = true;
    this.currentSort = "title";
    this.toggleCount = 0;
  }


  getSubRows = (shouldRun, sortBy) => {
    if (shouldRun) {  // protects against inf. loop
      this.shouldRun = false;

      let myQuery = "";
      switch(sortBy) {
        case "title":
            myQuery = "SELECT S.subID, S.title, S.description, S.status, S.fileURL, T.subID AS TopicID," +
                      "T.topic FROM SUBMISSION S LEFT JOIN TOPICS T ON S.subID = T.subID ORDER BY S.title";
            break;
        case "description":
            myQuery = "SELECT S.subID, S.title, S.description, S.status, S.fileURL, T.subID AS TopicID," +
                      "T.topic FROM SUBMISSION S LEFT JOIN TOPICS T ON S.subID = T.subID ORDER BY S.description";
            break;
        case "topic": 
            myQuery = "SELECT S.subID, S.title, S.description, S.status, S.fileURL, T.subID AS TopicID," +
                      "T.topic FROM SUBMISSION S LEFT JOIN TOPICS T ON S.subID = T.subID ORDER BY T.topic";
            break;
        case "status":
            myQuery = "SELECT S.subID, S.title, S.description, S.status, S.fileURL, T.subID AS TopicID," +
                      "T.topic FROM SUBMISSION S LEFT JOIN TOPICS T ON S.subID = T.subID ORDER BY S.status";
            break;
        default:
            myQuery = "SELECT S.subID, S.title, S.description, S.status, S.fileURL, T.subID AS TopicID," +
                      "T.topic FROM SUBMISSION S LEFT JOIN TOPICS T ON S.subID = T.subID ORDER BY S.title";
      }
      if (sortBy === this.currentSort) {
          this.toggleCount++;
          if (this.toggleCount % 2 === 1)
              myQuery += " DESC";
      } else {
          this.toggleCount = 0;
          this.currentSort = sortBy;
      }
      
      fetch('http://localhost:9000/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: myQuery })
      }).then(response => {
        response.json().then(data => {
          let subInfo = JSON.parse(JSON.stringify(data));
          console.log(data);
          const numSubs = subInfo.length;
          let tableRows = [];
          let origIndex = 0;
          let rowIndex = 1;
          for (let i = 0; i < numSubs; i++) {

            origIndex = i;
            this.setState({subID: subInfo[origIndex].subID});
            while ( (i+1 < numSubs)  &&  (subInfo[i+1].subID === subInfo[origIndex].subID) ) {
              subInfo[origIndex].topic += ", " + subInfo[i+1].topic;
              i++;
            }

          tableRows.push(
            <tr key={rowIndex}>
              <td>{rowIndex}</td>

              <td><a href={'comments?subID=' + subInfo[origIndex].subID}>{subInfo[origIndex].title}</a></td>
              {/* <Nav.Link href="/comments">{subInfo[origIndex].title}</Nav.Link> */}
              <td>{subInfo[origIndex].description}</td>
              <td>{subInfo[origIndex].topic}</td>
              <td>{subInfo[origIndex].status}</td>
              <td><a href={subInfo[origIndex].fileURL}>download</a></td>
            </tr>);
            rowIndex++;
          }
          this.setState({tableRows: tableRows});
        });
      });
    }
  }


  render() {
    return (
      <div id="list-submissions">
        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{padding: '0 0 8px 10px'}}>#</th>
                <th><button onClick={ (ev) => this.getSubRows(true, "title", ev) }>Research Title</button></th>
                <th><button onClick={ (ev) => this.getSubRows(true, "description", ev) }>Description</button></th>
                <th><button onClick={ (ev) => this.getSubRows(true, "topic", ev) }>Topic</button></th>
                <th><button onClick={ (ev) => this.getSubRows(true, "status", ev) }>Status</button></th>
                <th style={{padding: '0 0 8px 10px'}}>File</th>
              </tr>
            </thead>
            <tbody>
              { this.getSubRows(this.shouldRun) }
              { this.state.tableRows }
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ListSubs;
