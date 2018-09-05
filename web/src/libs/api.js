import { default as localforage } from 'localforage'
import { task } from './task'
import {
  Feathers,
  FeathersIO,
  IO,
  FeathersAuth,
} from './packages'

export const createApiClient = task(
  t => props => {
    const client = Feathers()
    client.configure(FeathersIO(IO(props.path, {
      pingTimeout: 100000,
      timeout: 100000,
      transports: [ 'websocket' ],
      forceNew: true,
    })))
    client.configure(
      FeathersAuth(
        t.merge(
          {
            storage: !t.has('storage')(props)
              ? localforage
              : props.storage,
          },
          !t.has('auth')(props)
            ? {}
            : props.auth,
        ),
      ),
    )
    if (t.eq(
        'Function',
        t.type(t.path([ 'configure' ], props)),
      )) {
      client.configure(props.configure)
    }
    return client
  },
)
