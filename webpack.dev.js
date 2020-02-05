const path = require('path');
const commonSettings = require('./webpack.common');

module.exports = Object.assign(commonSettings, {
  mode: 'development',
  watch: true,
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
  }
});