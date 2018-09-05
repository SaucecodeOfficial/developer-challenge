import {
  createStateBox,
  task,
  VIEW_STATUS,
  matchedNavItem,
} from '../../../libs'

import {
  NAV_MODE,
  NAV_STATUS,
  PATHS,
} from '../ctx'

//tasks
import {
  screenSizeName,
  isPathInTopSchema,
  topSchemaWithoutPath,
  updateSchemaInPlace,
} from './tasks'

// exports
export const layoutState = createStateBox({
  name: 'layout',
  initial: {
    status: VIEW_STATUS.INIT,
    title: '',
    window: {
      width: 0,
      height: 0,
      size: 'sm',
    },
    nav: {
      status: NAV_STATUS.INIT,
      mode: NAV_MODE.SECONDARY,
      item: null,
      schema: [],
    },
  },
  mutations(m) {
    return [
      m('WINDOW_RESIZE', task(
        t => (state, action) => {
          return t.merge(state, {
            window: t.merge(state.window, action.payload),
          })
        },
      )),
      m([ 'NAV_SCHEMA_REGISTER' ], task(
        t => (state, action) => {
          const schema = t.path(PATHS.NAV_SCHEMA, state)
          const nextSchemaToRegister = t.filter(
            schemaItem => t.not(isPathInTopSchema(
              schemaItem.path,
              schema || [],
            )),
            t.path(PATHS.ACTION_SCHEMA, action),
          )
          return t.merge(state, {
            nav: t.merge(state.nav, {
              schema: t.concat(
                schema,
                nextSchemaToRegister || [],
              ),
            }),
          })
        },
      )),
      m([ 'NAV_SCHEMA_UPDATE' ], task(
        t => (state, action) => {
          return t.merge(state, {
            nav: t.merge(state.nav, {
              schema: updateSchemaInPlace(
                t.path(PATHS.ACTION_SCHEMA, action),
                t.path(PATHS.NAV_SCHEMA, state),
              ),
            }),
          })
        },
      )),
      m([ 'NAV_SCHEMA_REMOVE' ], task(
        t => (state, action) => {
          return t.merge(state, {
            nav: t.merge(state.nav, {
              schema: topSchemaWithoutPath(
                t.path(PATHS.ACTION_NAV_PATH, action),
                t.path(PATHS.NAV_SCHEMA, state),
              ),
            }),
          })
        },
      )),
      m([ 'NAV_ITEM_UPDATE' ], task(
        t => (state, action) => {
          return t.merge(state, {
            nav: t.merge(state.nav, {
              item: t.path(PATHS.ACTION_NAV_ITEM, action),
            }),
          })
        },
      )),
    ]
  },
  effects(fx, { actions, mutations }) {
    return [
      task(t => fx(
        [
          t.globrex('*ROUTE_*').regex,
          actions.navSchemaRegister,
          actions.navSchemaUpdate,
          actions.navSchemaRemove,
        ],
        async ({ getState }, dispatch, done) => {
          const state = getState()
          if (!state.location) {
            done()
          }
          else {
            const schema = t.path(PATHS.LAYOUT_NAV_SCHEMA, state)
            const pathname = t.path(PATHS.LOCATION_PATHNAME, state)
            const item = t.path(PATHS.LAYOUT_NAV_ITEM, state)
            // match item
            const nextItem = matchedNavItem(
              pathname,
              schema,
            )
            // validate item
            const validItem = t.not(nextItem)
              ? t.not(item)
                ? nextItem
                : pathname.includes(item.path)
                  ? item
                  : nextItem
              : t.or(
                t.not(nextItem.children),
                t.isZeroLen((
                  nextItem.children || []
                )),
              )
                ? item
                  ? pathname.includes(item.path)
                    ? item
                    : matchedNavItem(
                      nextItem.parentPath,
                      schema,
                    )
                  : matchedNavItem(
                    nextItem.parentPath,
                    schema,
                  )
                : nextItem

            // skip if payload matches current state
            if (t.or(
                t.not(item),
                t.not(t.eq(
                  t.path([ 'path' ], item || {}),
                  t.path([ 'path' ], validItem || {}),
                )),
              )) {
              const route = t.path([
                ...PATHS.LOCATION_ROUTE_MAP,
                state.location.type,
              ], state)
              const nextTitle = t.has('title')(route || {})
                ? route.title
                : t.caseTo.sentenceCase(
                  t.tags.oneLineInlineLists`${t.split('/', pathname)}`,
                )
              dispatch(
                mutations.navItemUpdate({
                  item: validItem,
                  title: nextTitle,
                }),
              )
              done()
            }
            else {
              done()
            }
          }
        },
        ),
      ),
    ]
  },
  onInit: task(t => ({
    dispatch,
    mutations,
  }) => {
    const handleResize = t.throttle(() => {
      dispatch(
        mutations.windowResize({
          width: window.innerWidth,
          height: window.innerHeight,
          size: screenSizeName(window.innerWidth),
        }),
      )
    }, 300)
    handleResize()
    window.addEventListener('resize', handleResize)
    window.onbeforeunload = function () {
      window.removeEventListener('resize', handleResize)
      return undefined
    }
  }),

})