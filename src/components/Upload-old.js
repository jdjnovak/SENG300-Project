import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

function GetUploads() {
    return (
        <tr>
          <td>1</td>
          <td>20/01/2020</td>
          <td>journal_01.docx</td>
          <td>Download</td>
        </tr>
    );
}

function Upload() {
    return (
        <Container>
          <Row>
            <Col>
              <br/>
              <Form width={50}>
                <Form.Group>
                  <input type="file" className="form-control" id="journalFile" />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <th>#</th>
                  <th>Upload Date</th>
                  <th>Name</th>
                  <th>Actions</th>
                </thead>
                <tbody>
                  { GetUploads() }
                </tbody>
              </Table>
            </Col>
          </Row>
       </Container>
    );
}

export default Upload;
