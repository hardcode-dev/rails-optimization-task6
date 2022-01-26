const environment = require('./environment');

// For more information, see https://webpack.js.org/configuration/devtool/#devtool

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

environment.plugins.append(
  'BundleAnalyzer',
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: true,
  }),
);

const config = environment.toWebpackConfig();
config.devtool = 'eval-source-map';
module.exports = config;
