import { createFeature } from '../../libs'
import { mailApi } from './api'

export default createFeature(
  () => (
    {
      name: 'mail',
      api: [ mailApi ],
    }
  ),
)