export { VIEW_STATUS } from '../../libs'

export const ACCOUNT_STATUS = {
  INIT: 'init',
  AUTH_LOADING: 'auth-loading',
  AUTH_SUCCESS: 'auth-success',
  AUTH_FAIL: 'auth-fail',
}

export const VIEWS = {
  SIGN_IN: 'signIn',
  SIGN_UP: 'signUp',
  VERIFY: 'verify',
  RESET_PASSWORD: 'resetPassword',
  RESET_PASSWORD_CONFIRM: 'reset',
  CHANGE_IDENTITY: 'change',
  NOT_AUTHORIZED: 'notAuthorized',
}

export const PATHS = {
  ACCESS_TOKEN: [
    'accessToken',
  ],
  ACTION_LOCATION: [
    'meta',
    'location',
    'current',
  ],
  ACTION_LOCATION_PATHNAME: [
    'meta',
    'location',
    'current',
    'pathname',
  ],
  ACTION_USER: [
    'payload',
    'user',
  ],
  ACTION_DATA: [
    'payload',
    'data',
  ],
  ACTION_ERROR: [
    'payload',
    'error',
  ],
  ACTION_MESSAGE: [
    'payload',
    'message',
  ],
  ACTION_REDIRECT: [
    'payload',
    'redirectBackTo',
  ],
  LOCATION_ROUTE_MAP: [
    'location',
    'routesMap',
  ],
  ACCOUNT_STATUS: [
    'account',
    'status',
  ],
  ACCOUNT_USER: [
    'account',
    'user',
  ],
  ACCOUNT_VIEW: [
    'account',
    'view',
  ],
  ACCOUNT_VIEW_KEY: [
    'account',
    'view',
    'key'
  ],
  ACCOUNT_HASH: [
    'account',
    'hash',
  ],
  ACCOUNT_FORM_DATA: [
    'account',
    'form',
    'data',
  ],
}