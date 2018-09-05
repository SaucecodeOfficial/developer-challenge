import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import {
  createApiClient,
  createStateStore,
  reloadStateStore,
} from './libs'
// hot code
import App from './App'
import features from './features'
// state
const store = createStateStore({
  boxes: features.state,
  context: {
    api: createApiClient({
      path: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3030'
        : '/',
    })
  },
  history: createHistory(),
})

// ui
const load = () => {
  render(
    <Provider store={store}>
      <App routes={features.routes}/>
    </Provider>,
    document.getElementById('root'),
  )
}
// reload
if (module.hot) {
  module.hot.accept([
    './App',
    './features',
  ], () => {
    reloadStateStore(store, features.state)
    load()
  })
}
// run
load()