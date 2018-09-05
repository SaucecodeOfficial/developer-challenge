import React from 'react'
import cxs from 'cxs'
import { task, Link } from '../../../libs'

// ui
import {
  Container,
  Button,
} from 'reactstrap'
import { Page } from './Page'

const contentCss = cxs({
  minHeight: '60vh',
  ' .link': {
    textDecoration: 'none',
  },
})

// exports
export const NotFoundPage = task(
  t => ({
    heading,
    text,
    to,
    linkText,
  }) => {
    const contentProps = {
      className: t.tags.oneLine`
        position-relative
        d-flex
        flex-column
        align-items-center
        justify-content-center
        ${contentCss}
      `,
    }
    const linkProps = {
      className: t.tags.oneLine`
        link
        text-gray-500
        text-center
        py-3
      `,
      to: t.not(to)
        ? '/'
        : to,
    }
    return (
      <Page>
        <Container>
          <div {...contentProps}>
            <h1 className='text-primary'>
              {t.not(heading)
                ? 'Page not found'
                : heading
              }
            </h1>
            <p>
              {t.not(text)
                ? 'The page you are looking for cannot be found.'
                : text
              }
            </p>
            <Link {...linkProps}>
              {t.not(linkText)
                ? 'Return Home'
                : linkText
              }
            </Link>
          </div>
        </Container>
      </Page>
    )
  },
)