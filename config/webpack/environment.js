// const { environment } = require('@rails/webpacker');
// const customConfig = require('./custom');

// environment.config.set('resolve.extensions', ['.foo', '.bar']);
// environment.config.set('output.filename', '[name].js');
// environment.config.merge(customConfig);
// environment.config.delete('output.chunkFilename');

// module.exports = environment;

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.append(
  'CommonsChunkVendor',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => {
      // this assumes your vendor imports exist in the node_modules directory
      return (
        module.context &&
        module.context.indexOf('node_modules') !== -1 &&
        module.context.indexOf('moment') === -1 &&
        module.context.indexOf('chart.js') === -1 &&
        module.context.indexOf('marked') === -1
      )
    }
  })
)

environment.plugins.append('BundleAnalyzer', new BundleAnalyzerPlugin())

environment.plugins.append(
  'ContextReplacementPlugin',
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
)

environment.plugins.append(
  'CommonsChunkManifest',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  })
)

module.exports = environment
