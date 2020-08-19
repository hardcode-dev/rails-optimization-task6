const environment = require('./environment');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

environment.plugins.append(
  'BundleAnalyzer',
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '/home/mikeoil/opt/rails-optimization-task6/report.html',
    openAnalyzer: true,
  }),
);

const config = environment.toWebpackConfig();

// For more information, see https://webpack.js.org/configuration/devtool/#devtool
config.devtool = 'eval-source-map';

module.exports = config;
