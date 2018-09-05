import { createFeature } from '../../libs'

// state
import { landingState } from './state'

// ui
import { LandingPage } from './ui'

// exports
export default createFeature(
  ({ ui }) => (
    {
      name: 'landing',
      state: [ landingState ],
      routes: [
        {
          type: [ landingState.actions.routeHome ],
          ui: LandingPage({ ui }),
        },
      ],
    }
  ),
)
