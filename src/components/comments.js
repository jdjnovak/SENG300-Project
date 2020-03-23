import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Comments() {

/*}  submitFormHandler = event => {
    event.preventDefault();

    console.dir(this.refs.Id.value); //will give us the name value
    console.dir(this.refs.Name.value);
    console.dir(this.refs.Paper.value);
    console.dir(this.refs.Comments.value);
    console.dir(this.refs.Decision.value);
    console.dir(this.refs.Date.value);
  }*/
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleSubmit = () => {

      var obj = {comments: []};
      //obj.comments.push({id: document.getElementById('Id').value, Name: placeholderName, Paper: placeholderPaper, Comments: placeholderComments, Decision: placeholderDecision, Date: placeholderDate});
        obj.comments.push({id: "3", Name: "ronald", Paper: "Cat in the hat", Comments:"the intro needs some more work ", Decision: "Major Reveiw", Date: "November 12, 2020"});
      var json = JSON.stringify(obj);
      var fs = require('browserify-fs');
      fs.writeFile('test_data.json', json, (err) => {
        if (err)  throw err;
      });
      fs.readFile('test_data.json', 'utf8', function readFileCallback(err, data){
        if(err){
          console.log(err);
        } else {
          obj = JSON.parse(data);
          obj.comments.push({id: "1", Name: "Cat", Paper: "Green eggs and ham", Comments:"Amazing job on the book ", Decision: "Minor Reveiw", Date: "June 12, 2020"});
          json = JSON.stringify(obj);
          fs.writeFile('test_data.json', json, (err) => {
            if(err) throw err;
          });
        }});
    };

    const handleShow = () => setShow(true);

    return (
        <>
          <Button variant="primary" onClick={handleShow}>
            Comments
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="text-center">
              <Modal.Title>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>

                <Form.Group controlId="formPlaintextId">
                  <Form.Label column>
                    Id:
                    {/*<input type = "text" name ="Id" ref="Id"/>*/}
                  </Form.Label>
                  <Form.Control placeholderID="012345678" />
                </Form.Group>

                <Form.Group controlId="formPlaintextName">
                  <Form.Label column>
                    Name:
                    {/*<input type = "text" name ="Name" ref="Name"/>*/}
                  </Form.Label>
                  <Form.Control placeholderName="John Smith" />
                </Form.Group>

                <Form.Group controlId="formPlaintextPaper">
                  <Form.Label column>
                    Paper:
                    {/*<input type = "text" name ="Paper" ref="Paper"/>*/}
                  </Form.Label>
                  <Form.Control placeholderPaper="Book of Life" />
                </Form.Group>

                <Form.Group controlId="formPlaintextComments">
                  <Form.Label column>
                    Comments:
                    {/*<input type = "text" name ="Comments" ref="Comments"/>*/}
                  </Form.Label>
                  <Form.Control placeholderComments="was very good" />
                </Form.Group>

                <Form.Group controlId="formPlaintextDecision">
                  <Form.Label column>
                    Decision:
                    {/*<input type = "text" name ="Decision" ref="Decision"/>*/}
                  </Form.Label>
                  <Form.Control placeholderDecision="Major Review" />
                </Form.Group>

                <Form.Group controlId="formPlaintextDate">
                  <Form.Label column>
                    Date:
                    {/*<input type = "text" name ="Date" ref="Date"/>*/}
                  </Form.Label>
                  <Form.Control placeholderDate="March 20, 2020" />
                </Form.Group>

                <Form.Group>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>{' '}
                  {/*<Button variant="primary" onClick={handleSubmit}>*/}
                  <Button variant="primary" onClick={handleClose}>
                    Submit
                  </Button>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
        </>
    );
}

export default Comments;
