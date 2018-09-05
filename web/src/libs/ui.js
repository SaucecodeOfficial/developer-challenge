import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// libs
import { task } from './task'

// exports
export const renderRoute = task(
  t => (actionType, routes) => {
    const matchedDef = t.find(
      routeDef => t.gt(
        t.findIndex(
          type => t.eq(actionType, type),
          t.isType(routeDef.type, 'Array')
            ? routeDef.type
            : [ routeDef.type ],
        ),
        -1,
      ),
      routes || [],
    )
    if (t.not(t.path([ 'ui' ], matchedDef))) {
      return null
    }
    return React.createElement(
      matchedDef.ui,
      { key: actionType },
    )
  },
)

export const connectState = task(
  t => (selector, mutations = undefined) => connect(
    selector,
    (
      t.notType(mutations, 'Object')
        ? dispatch => {
          return { dispatch }
        }
        : dispatch => {
          return {
            dispatch,
            mutations:
              bindActionCreators(
                mutations,
                dispatch,
              ),
          }
        }
    ),
  ),
)

export const VIEW_STATUS = {
  INIT: 'init',
  WAITING: 'waiting',
  READY: 'ready',
  LOADING: 'loading',
  COMPLETE: 'complete',
  SUCCESS: 'success',
  FAIL: 'fail',
}