import React from 'react'
import { task } from '../../../libs'

// exports
export const Page = task(
  t => ({ className, children, ...props }) => {
    const pageProps = {
      className: t.tags.oneLine`
        page
        position-relative
        d-flex
        flex-column
        w-100
        ${className}
      `,
      ...props,
    }
    return (
      <div {...pageProps}>
        {children}
      </div>
    )
  },
)
