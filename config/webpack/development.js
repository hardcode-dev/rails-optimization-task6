const environment = require('./environment');
const config = environment.toWebpackConfig();

// For more information, see https://webpack.js.org/configuration/devtool/#devtool
config.devtool = 'eval-source-map';

// node_modules/.bin/webpack --config config/webpack/production.js --profile --json > stats.json
// node_modules/.bin/webpack-bundle-analyzer stats.json

module.exports = config;
