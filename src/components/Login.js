import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Login() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button variant="primary" onClick={handleShow}>
            Login
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="text-center">
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formPlaintextEmail">
                  <Form.Label column>
                    Email
                  </Form.Label>
                  <Form.Control placeholder="email@example.com" />
                </Form.Group>
                <Form.Group controlId="formPlaintextPassword">
                  <Form.Label column>
                    Password
                  </Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>{' '}
                  <Button variant="primary" onClick={handleClose}>
                    Login
                  </Button>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>
        </>
    );
}

export default Login;
