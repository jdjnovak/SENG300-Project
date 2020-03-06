import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import comments from '../data/test_data.json';

function GetCommentBody() {
    let ary = [];
    for (let i = 0; i < comments.length(); i++) {
        ary.push(<Tab.Pane eventKey={"#link" + i.toString()}>{comments[i].body}</Tab.Pane>);
    }
    return ary;
}

function CommentsTable() {
    return (
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Row>
            <Col sm={4}>
              <ListGroup>
                <ListGroup.Item action href="#link1">
                  Link 1
                </ListGroup.Item>
                <ListGroup.Item action href="#link2">
                  Link 2
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                {this.GetCommentBody()}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    );
}

export default CommentsTable;
