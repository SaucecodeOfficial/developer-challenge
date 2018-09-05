import { task } from './task'

// exports
export const combineFeatures = task(
  t => featureList => t.reduce(
    (combinedFeatures, feature) => {
      return {
        api: t.notType(
          t.path([ 'api' ], feature),
          'Array',
        )
          ? combinedFeatures.api
          : t.concat(
            combinedFeatures.api,
            t.path([ 'api' ], feature),
          ),
        hooks: t.notType(
          t.path([ 'hooks' ], feature),
          'Object',
        )
          ? combinedFeatures.hooks
          : t.merge(
            combineFeatures.hooks, {
              [feature.name || 'common']: t.path([ 'hooks' ], feature),
            },
          ),
        tasks: t.notType(
          t.path([ 'tasks' ], feature),
          'Object',
        )
          ? combinedFeatures.tasks
          : t.merge(
            combineFeatures.tasks, {
              [feature.name || 'common']: t.path([ 'tasks' ], feature),
            },
          ),
      }
    },
    {
      api: [],
      hooks: {},
      tasks: {},
    },
    featureList,
  ),
)

export const createFeature = task(
  t => (factory, defaultProps = {}) => {
    return props => factory(
      t.merge(defaultProps, props),
    )
  },
)
