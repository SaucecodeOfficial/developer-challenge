import {
  compose,
  combineReducers,
  applyMiddleware,
  createStore,
} from 'redux'
import {
  createLogic,
  createLogicMiddleware,
} from 'redux-logic'
import {
  composeReducers,
  makeActionCreator,
} from 'redux-toolbelt'
import { createLogger } from 'redux-logger'
// routing
import { connectRoutes, redirect } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'
// libs
import { task } from './task'

// STATE BOX:
// A declarative interface over redux, redux-toolbelt and redux logic to avoid unnecessary boilerplate
// and enforce a consistent and predictable functional state management style of:
// guard(s) -allow/reject-> mutation(s) -> side effect(s) -> mutation(s)

// MUTATIONS:
// Mutations of state are defined as the combination of action types and reducers,
// invoked by the generated action creator
// A mutation is created with the mutation function:
// mutation(actionTypes: string | string[], reducer: (state, action)=> nextState) {}
// which returns the following for composing into the consuming statebox:
// { mutations: [f()], actions:[''], reducer(){} }

const makeMutationCreator = task(
  t => (name, initialState) => (actionOrActions, reducer) => {
    const createAction = makeActionCreator
      .withDefaults({
        prefix: `${name}/`,
      })
    const transforms = t.reduce(
      (mutations, item) => {
        return {
          actions: t.merge(mutations.actions, {
            [`${item.action}`]: item.mutation.TYPE,
          }),
          mutations: t.merge(mutations.mutations, {
            [`${item.action}`]: item.mutation,
          }),
          reducers: t.merge(mutations.reducers, {
            [item.mutation.TYPE]: reducer,
          }),
        }
      },
      {
        actions: {},
        mutations: {},
        reducers: {},
      },
      t.map(type => {
        return {
          action: t.caseTo.camelCase(type),
          mutation: createAction(t.caseTo.constantCase(type)),
        }
      })((
        t.eq('Array', t.type(actionOrActions))
          ? actionOrActions
          : [ actionOrActions ]
      )) || [],
    )
    return {
      mutations: transforms.mutations,
      actions: transforms.actions,
      reducer: (state = initialState, action) => {
        return !transforms.reducers[ action.type ]
          ? state
          : transforms.reducers[ action.type ](state, action)
      },
    }
  },
)

// EFFECTS:
// A light weight wrapper over the most excellent [redux-logic](https://github.com/jeffbski/redux-logic)
// implemented with simpler semantics and sensible defaults:
// guard -> validate
// effect -> process

const createEffect = task(
  t => type => (actionOrActions, processOrGuard, options = {}) => {
    const fx = t.eq('fx', type)
      ? { process: processOrGuard }
      : { validate: processOrGuard }
    return createLogic(
      t.mergeAll([
        { type: actionOrActions },
        options,
        fx,
      ]),
    )
  },
)


// STATE BOX:
// The fundamental building block for an application's state management.
// State box takes the following props:
// {
// name: string,
// initial: any,
// mutations: mutation => [ mutation(...) ],
// guards: (guard, { actions, mutations }) => [ guard(...) ]
// effects: (fx, { actions, mutations }) => [ guard(...) ]
// onInit: ({ dispatch, getState, actions, mutations, ...ctx }) => void
// }

export const createStateBox = task(
  t => ({
    name,
    initial,
    mutations,
    guards,
    effects,
    onInit,
  }) => {
    const nextHandles = t.reduce((handles, mutation) => {
      return {
        actions: t.merge(handles.actions, mutation.actions),
        mutations: t.merge(handles.mutations, mutation.mutations),
        reducers: t.concat(handles.reducers, [ mutation.reducer ]),
      }
    }, {
      actions: {},
      mutations: {},
      reducers: [],
    }, (
      !mutations
        ? []
        : mutations(
        makeMutationCreator(name || 'box', initial || {}))
    ))
    const effectContext = {
      actions: nextHandles.actions,
      mutations: nextHandles.mutations,
    }
    const nextGuards = !guards
      ? []
      : guards(createEffect('guards'), effectContext)
    const fx = !effects
      ? []
      : effects(createEffect('fx'), effectContext)
    return {
      name,
      actions: nextHandles.actions,
      mutations: nextHandles.mutations,
      reducer: composeReducers(...nextHandles.reducers),
      effects: t.concat(nextGuards || [], fx || []),
      onInit: !onInit
        ? undefined
        : ctx => {
          onInit(t.merge(ctx, {
            actions: nextHandles.actions,
            mutations: nextHandles.mutations,
          }))
        },
    }
  },
)

const passThrough = function () {
  return {}
}

export const combineStateBoxes = task(
  t => (boxes, reducer = undefined) => {
    const reduceBy = reducer && t.eq('Function', t.type(reducer))
      ? reducer
      : passThrough
    return t.reduce(
      (nextBoxes, box) => {
        return t.merge({
          reducers: t.merge(nextBoxes.reducers, { [box.name]: box.reducer }),
          effects: t.concat(nextBoxes.effects, box.effects),
          onInit: !box.onInit
            ? nextBoxes.onInit
            : t.concat(nextBoxes.onInit, [ box.onInit ]),
        }, reduceBy(nextBoxes, box))
      },
      {
        reducers: {},
        effects: [],
        onInit: [],
      },
      boxes,
    )
  },
)

// STATE STORE
// A light weight wrapper over redux's createStore with the
// ability to combine and extend further.
// State Store takes the following props:
// {
// boxes: [ stateBox(...) ],
// context: { ... },
// reducers: { ... },
// middleware: [ ... ],
// enhance: (appliedMiddleware) => [ ... ]
// initial: { ... }
// }

export const createStateStore = task(
  t => ({
    boxes,
    context,
    reducers,
    middleware,
    enhance,
    initial,
    logger,
    disableLogging,
  }) => {
    const nextBoxes = t.eq('Object', t.type(boxes))
      ? boxes
      : combineStateBoxes(boxes)
    const effects = createLogicMiddleware(nextBoxes.effects, context || {})
    const nextMiddleware = t.concat(middleware || [], [ effects ])
    if (t.and(
        logger,
        t.eq(process.env.NODE_ENV, 'development'),
      )) {
      if (t.not(disableLogging)) {
        nextMiddleware.push(logger)
      }
    }
    else if (t.eq(process.env.NODE_ENV, 'development')) {
      if (t.not(disableLogging)) {
        nextMiddleware.push(createLogger())
      }
    }
    const appliedMiddleware = applyMiddleware(...nextMiddleware)
    const storeArgs = t.eq('Function', t.type(enhance))
      ? enhance(appliedMiddleware)
      : initial
        ? [ initial, appliedMiddleware ]
        : [ appliedMiddleware ]
    const store = createStore(
      combineReducers(t.merge(nextBoxes.reducers, reducers || {})),
      ...storeArgs,
    )
    store._effects = effects
    store._reducers = reducers || {}
    const ctx = t.merge(context || {}, {
      getState: store.getState,
      dispatch: store.dispatch,
      subscribe: store.subscribe,
    })
    t.forEach(onInit => {
      if (t.eq('Function', t.type(onInit))) {
        onInit(ctx)
      }
    }, nextBoxes.onInit)
    return store
  },
)

export const reloadStateStore = task(
  t => (store, boxes) => {
    const nextBoxes = t.eq('Object', t.type(boxes))
      ? boxes
      : combineStateBoxes(boxes)
    store.replaceReducer(combineReducers(
      t.merge(
        nextBoxes.reducers,
        store._reducers,
      ),
    ))
    store._effects.replaceLogic(nextBoxes.effects)
    return null
  },
)

// ROUTING
// Routing is implemented with the most excellent [redux-first-router](https://github.com/faceyspacey/redux-first-router)
// State Box and Store will be extended to implement routing

const createRoute = task(
  t => (actionType, path, props = {}) => {
    return {
      [actionType]: t.merge({ path }, props),
    }
  },
)

export const createStateBoxWithRouting = task(
  t => (props) => {
    if (t.isType(
        t.path([ 'routes' ], props),
        'Function',
      )) {
      const box = createStateBox(props)
      return t.merge(box, {
        routes: t.mergeAll(props.routes(createRoute, box.actions) || []),
      })
    }
    return createStateBox(props)
  },
)

export const combineStateBoxesWithRouting = task(
  t => boxes => combineStateBoxes(
    boxes,
    (nextBoxes, box) => {
      return {
        routes: t.merge(
          nextBoxes.routes || {},
          box.routes,
        ),
      }
    },
  ),
)

export const createStateStoreWithRouting = task(
  t => (props = {}) => {
    const combinedBoxes = combineStateBoxesWithRouting(props.boxes)
    const router = connectRoutes(
      props.history,
      combinedBoxes.routes,
      t.merge(
        { restoreScroll: restoreScroll() },
        t.not(t.has('routerOptions')(props))
          ? {}
          : props.routerOptions,
      ),
    )
    return createStateStore(
      t.merge(t.omit([ 'routerOptions' ], props), {
        context: t.merge(
          props.context,
          { redirect },
        ),
        boxes: combinedBoxes,
        middleware: t.concat(
          props.middleware || [],
          [ router.middleware ],
        ),
        reducers: t.merge(
          props.reducers || {},
          {
            location: router.reducer,
          },
        ),
        enhance(appliedMiddleware) {
          return [
            compose(router.enhancer, appliedMiddleware),
          ]
        },
      }),
    )
  },
)

export const reloadStateStoreWithRouting = (
  store,
  boxes,
) => reloadStateStore(store, combineStateBoxesWithRouting(boxes))


