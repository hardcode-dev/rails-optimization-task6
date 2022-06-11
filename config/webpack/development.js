// eslint-disable-next-line no-undef
const environment = require('./environment');
const config = environment.toWebpackConfig();

// For more information, see https://webpack.js.org/configuration/devtool/#devtool
config.devtool = 'eval-source-map';

// eslint-disable-next-line no-undef
module.exports = config;
