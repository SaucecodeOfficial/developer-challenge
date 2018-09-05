import { createFeature } from '../../libs'

// defaults
import { VIEW_CONTENT } from './content'

// state
import { accountState } from './state'
// ui
import { AccountPage } from './ui'

// exports
export default createFeature(
  ({
    ui,
    homeRouteAction,
    content,
  }) => {
    const state = accountState({ content, homeRouteAction })
    return {
      name: 'account',
      state: [ state ],
      ui: {},
      routes: [
        {
          type: [
            state.actions.routeSignIn,
            state.actions.routeSignUp,
            state.actions.routeResetPassword,
            state.actions.routeAccountManagement,
            state.actions.routeNotAuthorized,
          ],
          ui: AccountPage({
            ui,
            accountState: state,
            content,
          }),
        },
      ],
    }
  },
  {
    homeRouteAction: 'landing/ROUTE_HOME',
    content: { VIEW_CONTENT },
  },
)