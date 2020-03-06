import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import commentsJson from '../data/test_data.json';

function GetCommentBody() {
    let ary = JSON.parse(JSON.stringify(commentsJson));
    let ret = [];
    for (let i = 0; i < ary.comments.length; i++) {
        ret.push(<Tab.Pane key={i} eventKey={"#link" + i.toString()}>{ary.comments[i].body}<br/><strong className="d-inline">Decision: </strong><u className="d-inline">{ary.comments[i].decision}</u></Tab.Pane>);
    }
    return ret;
}

function GetCommenterNameDate() {
    let ary = JSON.parse(JSON.stringify(commentsJson));
    let ret = [];
    for (let i = 0; i < ary.comments.length; i++) {
        ret.push(<ListGroup.Item action key={i} href={"#link" + i.toString()}>{ary.comments[i].reviewer + " - Commented on: " + ary.comments[i].date}</ListGroup.Item>);
    }
    return ret;
}

function CommentsTable() {
    return (
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Row>
            <Col xl={{ span: 4, offset: 2}} lg={{ span: 4, offset: 2 }} className="text-center">
              <ListGroup className="">
                { GetCommenterNameDate() }
              </ListGroup>
            </Col>
            <Col xl={4} lg={4}>
              <Tab.Content>
                { GetCommentBody() }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    );
}

export default CommentsTable;
