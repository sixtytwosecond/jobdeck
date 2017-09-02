//NODE_ENV=production node_modules/.bin/webpack
// webpack.config.js
const webpack = require('webpack');
const path = require('path');
var CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
  entry: './views/src/App.js',
  output: {
    path: './views/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015-node6'],
        plugins: [
            "transform-es2015-destructuring",
            "transform-object-rest-spread",
            "transform-es2015-shorthand-properties"
        ]
      }
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
  
};