import {
  createStateBoxWithRouting,
  createStateStoreWithRouting,
  reloadStateStoreWithRouting,
} from './state'

export { NOT_FOUND } from 'redux-first-router'
export { NavLink, default as Link } from 'redux-first-router-link'

export { task } from './task'
export {
  renderRoute,
  connectState,
  VIEW_STATUS,
} from './ui'
export {
  combineFeatures,
  createFeature,
} from './features'
export { createApiClient } from './api'
export { formSchema, navSchema, matchedNavItem } from './schema'
// export with routing aliased for semantics
export const createStateBox = createStateBoxWithRouting
export const createStateStore = createStateStoreWithRouting
export const reloadStateStore = reloadStateStoreWithRouting

