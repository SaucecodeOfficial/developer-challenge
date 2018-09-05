import { createFeature } from '../../libs'
import { accountApi } from './api'
import { communicate } from './mails'

export default createFeature(() => (
    {
      name: 'account',
      api: [
        accountApi,
      ],
      tasks: {
        communicate,
      },
    }
  ),
)