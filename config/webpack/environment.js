// const { environment } = require('@rails/webpacker');
// const customConfig = require('./custom');

// environment.config.set('resolve.extensions', ['.foo', '.bar']);
// environment.config.set('output.filename', '[name].js');
// environment.config.merge(customConfig);
// environment.config.delete('output.chunkFilename');

// module.exports = environment;

const { environment } = require('@rails/webpacker');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

environment.plugins.append(
  'CommonsChunkVendor',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: ({ context }) => {
      // this assumes your vendor imports exist in the node_modules directory
      return (
        context &&
        context.indexOf('node_modules') !== -1 &&
        !context.includes('moment') &&
        !context.includes('chart.js') &&
        !context.includes('chartjs-color') &&
        !context.includes('color-name')
      );
    },
  }),
);

environment.plugins.append(
  'CommonsChunkManifest',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity,
  }),
);

environment.plugins.append(
  'BundleAnalyzer',
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: true,
  }),
);

module.exports = environment;
