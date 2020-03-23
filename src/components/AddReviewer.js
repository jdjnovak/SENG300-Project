import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function AddReviewer() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button variant="Primary" onClick={handleShow}>
            Request Reviewers
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="text-center">
              <Modal.Title>AddReviewer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formPlaintextJournal">
                  <Form.Label column>
                    Journal
                  </Form.Label>
                  <Form.Control placeholder="Journal Title"/>
                </Form.Group>
                <Form.Group controlId="formPlaintextReviewer">
                  <Form.Label column>
                    Reviewer 1
                  </Form.Label>
                  <Form.Control type="Reviewer 1" placeholder="Reviewer 1"/>
                </Form.Group>
				<Form.Group controlId="formPlaintextReviewer">
                  <Form.Label column>
                    Reviewer 2
                  </Form.Label>
                  <Form.Control type="Reviewer 2" placeholder="Reviewer 2"/>
                </Form.Group>
			      <Form.Group controlId="formPlaintextReviewer">
                  <Form.Label column>
                    Reviewer 3
                  </Form.Label>
                  <Form.Control type="Reviewer 3" placeholder="Reviewer 3"/>
                </Form.Group>
				<Form.Group controlId="formPlaintextReviewer">
                  <Form.Label column>
                    Reviewer 4
                  </Form.Label>
                  <Form.Control type="Reviewer 4" placeholder="Reviewer 4"/>
                </Form.Group>
				
                <Form.Group>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>{' '}
                  <Button variant="Success" onClick={handleClose}>
                    Request Reviewers
                  </Button>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
        </>
    );
}

export default AddReviewer;