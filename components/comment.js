import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Buttom from 'react-bootstrap/Button';

const show = false;

function CommentsWindow() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button onClick={handleShow}></Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Please Submit Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Label className="text-light">ID</Form.Label>
                <Form.Control type="ID" placeholder="Enter ID number..." />
                <Form.Label className="text-light">Name</Form.Label>
                <Form.Control type="Name" placeholder="Enter Name..." />
                <Form.Label className="text-light">Journal</Form.Label>
                <Form.Control type="Journal" placeholder="Enter Journal Name..." />
                <Form.Label className="text-light">Comments</Form.Label>
                <Form.Control type="Comment" placeholder="Enter Comments..." />
                <Form.Label className="text-light">Decision</Form.Label>
                <Form.Control type="Decision" placeholder="Enter Decision..." />
                <Form.Label className="text-light">Date</Form.Label>
                <Form.Control type="Date" placeholder="Enter Date..." />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Form>
                <Button type="submit">Submit</Button>
              </Form>
            </Modal.Footer>
          </Modal>
        </>
    );
}

export default CommentsWindow;
