import { combineFeatures } from '../libs'

//features
import layoutFeature from './layout'
import accountFeature from './account'
import landingFeature from './landing'
import chatFeature from './chat'

// unpack
const layout = layoutFeature()
const { Page, Logo } = layout.ui

// exports
export default combineFeatures([
  layout,
  accountFeature({
    ui: { Page, Logo },
    homeRouteAction: 'landing/ROUTE_HOME',
    content: {
      VIEW_CONTENT: {
        BRAND_NAME: 'Saucecode',
        SIGN_IN: {
          TITLE: 'Login to your account',
        },
        SIGN_UP: {
          TITLE: 'Register an account',
        },
        SIGN_UP_SUCCESS: {
          TITLE: 'Thank you for registering a Saucecode account',
        },
        RESET_PASSWORD: {
          TITLE: 'Reset your account password',
        },
      },
    },
  }),
  landingFeature({ ui: { Page } }),
  chatFeature({ ui: { Page } }),
])