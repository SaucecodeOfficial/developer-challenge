import { task } from '../../../libs'

import {
  PATHS,
  VIEW_STATUS,
  ACCOUNT_STATUS,
} from '../ctx'

export const reduceForm = task(
  t => (state, action) => {
    return t.merge(state, {
      view: t.merge(state.view, {
        status: VIEW_STATUS.LOADING,
        error: null,
        message: null,
      }),
      form: t.merge(state.form, {
        data: t.path(PATHS.ACTION_DATA, action),
      }),
    })
  },
)

export const reduceFormSuccess = task(
  t => (state, action) => {
    return t.merge(state, {
      view: t.merge(state.view, {
        status: VIEW_STATUS.SUCCESS,
        error: null,
        message: null,
      }),
      form: t.merge(state.form, {
        data: {},
      }),
    })
  },
)

export const reduceFormFail = task(
  t => (state, action) => {
    return t.merge(state, {
      view: t.merge(state.view, {
        status: VIEW_STATUS.FAIL,
        error: t.path(PATHS.ACTION_ERROR, action),
        message: t.path(PATHS.ACTION_MESSAGE, action),
      }),
    })
  },
)

export const makeReduceFormRoute = task(
  t => ({ view, ui, status }) => (state, action) => {
    const redirectBackTo = t.path(
      PATHS.ACTION_REDIRECT,
      action,
    )
    return t.merge(state, {
      view: {
        key: view,
        status: t.not(status)
          ? VIEW_STATUS.READY
          : status,
        error: null,
        message: null,
      },
      form: {
        ui,
        data: t.eq(
          view,
          t.path([ 'view', 'key' ], state),
        )
          ? state.form.data
          : {},
      },
      redirectBackTo: t.not(redirectBackTo)
        ? null
        : redirectBackTo,
    })
  },
)

export const statusIsBusy = task(
  t => ({ status }) => t.or(
    t.eq(
      ACCOUNT_STATUS.AUTH_LOADING,
      status,
    ),
    t.eq(
      ACCOUNT_STATUS.INIT,
      status,
    ),
  ),
)