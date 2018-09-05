import {
  createStateBox,
  task,
  VIEW_STATUS,
} from '../../../libs'

// schemas
import { registerPrivateNav } from './schemas'

// exports
export const landingState = createStateBox({
  name: 'landing',
  initial: {
    status: VIEW_STATUS.INIT,
  },
  mutations(m) {
    return [
      m([ 'ROUTE_HOME' ], task(
        t => (state, action) => {
          return t.merge(state, {
            status: 'ready',
          })
        },
      )),
    ]
  },
  routes(r, actions) {
    return [
      r(actions.routeHome, '/',
        {
          authenticate: true,
        },
      ),
    ]
  },
  effects(fx, box) {
    return [
      fx([
        'account/AUTHENTICATE_SUCCESS',
        'account/SIGN_IN_SUCCESS',
      ], async (_, dispatch, done) => {
        dispatch(registerPrivateNav())
        done()
      }),
      fx([ box.actions.routeHome ], async ({
        redirect,
      }, dispatch, done) => {
        dispatch(
          redirect({
            type: 'chat/ROUTE_CHAT',
            payload: {},
          }),
        )
        done()
      }),
    ]
  },
})