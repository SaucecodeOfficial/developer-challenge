export const GRID_SIZES = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
}

export const NAV_MODE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
}

export const NAV_SIZES = {
  PRIMARY: 80,
  SECONDARY: 220,
  PAGE: 240,
  HEADER: 60,
}

export const NAV_STATUS = {
  INIT:'init',
  OPEN: 'open',
  CLOSED: 'closed',
}

export const PATHS = {
  ACTION_TITLE: [
    'payload',
    'title',
  ],
  ACTION_HEADER_STATE: [
    'payload',
    'headerState',
  ],
  ACTION_NAV_ITEM: [
    'payload',
    'item',
  ],
  ACTION_NAV_ITEM_PATH: [
    'payload',
    'item',
    'path',
  ],
  ACTION_VIEW:[
    'payload',
    'view'
  ],
  ACTION_SCHEMA: [
    'payload',
    'schema',
  ],
  ACTION_NAV_PATH: [
    'payload',
    'path',
  ],
  NAV_SCHEMA: [
    'nav',
    'schema',
  ],
  NAV_ITEM: [
    'nav',
    'item',
  ],
  NAV_ITEM_PATH: [
    'nav',
    'item',
    'path',
  ],
  LAYOUT_NAV_SCHEMA: [
    'layout',
    'nav',
    'schema',
  ],
  LOCATION_PATHNAME: [
    'location',
    'pathname',
  ],
  LOCATION_PREV_PATHNAME: [
    'location',
    'prev',
    'pathname',
  ],
  LOCATION_ROUTE_MAP: [
    'location',
    'routesMap',
  ],
  LAYOUT_NAV_ITEM: [
    'layout',
    'nav',
    'item',
  ],
  NAV_ITEM_UI_TARGET:[
    'ui',
    'target'
  ]
}
