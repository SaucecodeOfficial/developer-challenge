import { combineFeatures } from '../libs'
// features
import account from './account'
import mail from './mail'

// exports
export default combineFeatures([
  account(),
  mail(),
])
