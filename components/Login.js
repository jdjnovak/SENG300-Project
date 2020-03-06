import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Buttom from 'react-bootstrap/Button';

const show = false;

function LoginWindow() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button onClick={handleShow}></Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Please Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Label className="text-light">Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email..." />
                <Form.Label className="text-light">Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password..." />
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

export default LoginWindow;
