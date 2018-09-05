import React from 'react'
import cxs from 'cxs'
import { task } from '../../../libs'

// ui
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

const pageCss = cxs({
  minHeight: '80vh',
})

// exports
export const LandingPage = task(
  t => ({ ui: { Page } }) => (/* props */) => {
    const containerProps = {
      className: t.tags.oneLine`
          text-center
          d-flex
          flex-column
          justify-content-center
          align-items-center
          ${pageCss}
        `,
    }
    return (
      <Page>
        <Container {...containerProps}>
          <Row className='pt-3'>
            <Col>
              <h1 className='text-secondary'>Loading...</h1>
            </Col>
          </Row>
        </Container>
      </Page>
    )
  },
)