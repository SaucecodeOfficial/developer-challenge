import { createFeature } from '../../libs'
import { chatState } from './state'
import { ChatPage } from './ui'

export default createFeature(({ ui }) => (
    {
      name: 'chat',
      state: [ chatState ],
      routes: [
        {
          type: [ chatState.actions.routeChat ],
          ui: ChatPage({ ui }),
        },
      ],
    }
  ),
)
