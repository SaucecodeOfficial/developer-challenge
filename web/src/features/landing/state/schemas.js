import { navSchema } from '../../../libs'


export const privateNav = navSchema(
  n => [
    n([ 'chat' ], {
      icon: 'comments',
      exact: false,

    }),
    n('/', {
      icon: 'power-off',
      action: {
        type: 'account/SIGN_OUT',
        payload: { view: 'account' },
      },
    })
  ],
)

export const registerPrivateNav = function () {
  return {
    type: 'layout/NAV_SCHEMA_REGISTER',
    payload: {
      schema: privateNav,
    },
  }
}