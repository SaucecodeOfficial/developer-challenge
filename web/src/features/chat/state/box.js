import { createStateBox, task, VIEW_STATUS } from '../../../libs'

// TODO: Chat State and Api integration
export const chatState = createStateBox({
  name: 'chat',
  initial: {
    status: VIEW_STATUS.INIT,
    view: null,
    data: null,
  },
  mutations(m) {
    return [
      m([ 'ROUTE_CHAT' ], task(
        t => (state, action) => {
          return t.merge(state, action.payload || {})
        },
      )),
    ]
  },
  routes(r, actions) {
    return [
      r(actions.routeChat, '/chat', {
        authenticate: true,
      }),
    ]
  },
  onInit({
    dispatch,
    getState,
    api,
    mutations
  }) {

  },
})