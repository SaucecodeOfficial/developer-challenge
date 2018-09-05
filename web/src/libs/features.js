import { task } from './task'

export const combineFeatures = task(
  t => featureList => t.reduce(
    (combinedFeatures, feature) => {
      return {
        state: t.notType(
          t.path([ 'state' ], feature),
          'Array',
        )
          ? combinedFeatures.state
          : t.concat(
            combinedFeatures.state,
            t.path([ 'state' ], feature),
          ),
        ui: t.notType(
          t.path([ 'ui' ], feature),
          'Object',
        )
          ? combinedFeatures.ui
          : t.merge(
            combinedFeatures.ui,
            {
              [feature.name]: t.path([ 'ui' ], feature),
            },
          ),
        routes: t.notType(
          t.path([ 'routes' ], feature),
          'Array',
        )
          ? combinedFeatures.routes
          : t.concat(
            combinedFeatures.routes,
            t.path([ 'routes' ], feature),
          ),
        tasks: t.notType(
          t.path([ 'tasks' ], feature),
          'Object',
        )
          ? combinedFeatures.tasks
          : t.merge(
            combinedFeatures.tasks, {
              [feature.name]: t.path([ 'tasks' ], feature),
            },
          ),
      }
    },
    {
      state: [],
      ui: {},
      routes: [],
      tasks: {},
    },
    featureList,
  ),
)

export const createFeature = task(
  t => (factory, initial) => (props = {}) => {
    const ui = t.path([ 'ui' ], props)
    return factory(
      t.merge(
        t.mergeDeepRight(
          initial,
          t.omit([ 'ui' ], props),
        ),
        { ui },
      ),
    )
  },
)
