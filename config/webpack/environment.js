// const { environment } = require('@rails/webpacker');
// const customConfig = require('./custom');

// environment.config.set('resolve.extensions', ['.foo', '.bar']);
// environment.config.set('output.filename', '[name].js');
// environment.config.merge(customConfig);
// environment.config.delete('output.chunkFilename');

// module.exports = environment;

const { environment } = require('@rails/webpacker');
const webpack = require('webpack');

environment.plugins.append(
  'CommonsChunkVendor',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module => {
      return (
        module.context &&
        module.context.indexOf('node_modules') !== -1 &&
        module.context.indexOf('vendor') === -1 &&
        module.context.indexOf('twillio') === -1 &&
        module.context.indexOf('sockjs') === -1 &&
        module.context.indexOf('moment') === -1 &&
        module.context.indexOf('chart.js') === -1
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

module.exports = environment;
