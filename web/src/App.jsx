import React from 'react'
import { renderRoute } from './libs'

// hot
import features from './features'

// unpack
const { layout: { Root } } = features.ui

// exports
const App = ({ routes }) => {
  return (
    <Root>
      {
        ({ type }) => renderRoute(type, routes)
      }
    </Root>
  )
}

export default App
