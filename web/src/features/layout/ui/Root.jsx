import React from 'react'
import cxs from 'cxs'
import { task, connectState } from '../../../libs'

//ctx
import { NAV_SIZES } from '../ctx'

// ui
import { Button } from 'reactstrap'
import {
  AppNav,
} from './AppNav'

const rootCss = cxs({
  zIndex: 1,
  flex: 1,
  fontFamily: `'Roboto', sans-serif`,
  minHeight: '100vh',
  '.primary': {
    ' .page': {
      marginLeft: `${NAV_SIZES.PRIMARY}px`,
    },
  },
})

const stateQuery = ({
  account,
  layout,
  location,
}) => (
  {
    account,
    location,
    layout,
  }
)

// exports
export const Root = task(
  t => connectState(stateQuery)(
    ({
      dispatch,
      account,
      location,
      layout,
      className,
      style,
      children,
    }) => {
      const rootProps = {
        className: t.tags.oneLine`
          root
          position-relative
          d-flex
          flex-columns
          w-100
          m-0
          ${t.eq(account.status, 'auth-success') ? 'primary':''}
          ${rootCss}
          ${className}
        `,
        style,
      }
      return (
        <div {...rootProps}>
          {t.not(
            t.and(
              t.eq(account.status, 'auth-success'),
              account.user,
            ),
          )
            ? null
            : <AppNav nav={layout.nav}
                      dispatch={dispatch}/>
          }
          {t.not(children)
            ? null
            : children({
              type: location.type,
              window: layout.window,
            })
          }
        </div>
      )
    },
  ),
)