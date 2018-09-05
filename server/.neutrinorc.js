// const nodeExternals = require('webpack-node-externals')
module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    '@neutrinojs/node',
  ],
}
