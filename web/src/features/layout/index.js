import { createFeature, NOT_FOUND } from '../../libs'

// state
import { layoutState } from './state'

// ui
import {
  Root,
  Page,
  NotFoundPage,
  Logo,
} from './ui'

// exports
export default createFeature(() => (
    {
      name: 'layout',
      state: [ layoutState ],
      ui: {
        Root,
        Page,
        Logo,
      },
      routes: [
        {
          type: [ NOT_FOUND ],
          ui: NotFoundPage,
        },
      ],
    }
  ),
)
