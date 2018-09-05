import { createAppServer, reloadAppServer } from './libs'
import features from './features'
import { logHook } from './hooks'

process.on('unhandledRejection', (reason, p) =>
  console.log('Unhandled Rejection at: Promise ', p, reason),
)

let app = createAppServer(
  {
    boxes: features.api,
    namespace: 'api',
    appFolderName: 'site',
    hooks: {
      after: {
        all: [ logHook ],
      },
      error: {
        all: [ logHook ],
      },
    },
  },
  () => {
    const host = app.api.get('host')
    const port = app.api.get('port')
    console.log(
      `App Server started on http://${host}:${port}`,
    )
  },
)

if (module.hot) {
  module.hot.accept([
    './features',
    './hooks',
  ], () => {
    app = reloadAppServer(app, { boxes: features.api })
  })
}
