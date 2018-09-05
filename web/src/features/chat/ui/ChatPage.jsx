import React from 'react'

import {
  Container,
  Row,
  Col,
} from 'reactstrap'

// TODO: Chat Page with state
export const ChatPage = ({ ui: { Page } }) => (props) => {
  return (
    <Page>
      <Container className='p-3'>
        <Row>
          <Col>
            <h1>Chat Page</h1>
          </Col>
        </Row>
      </Container>
    </Page>
  )
}