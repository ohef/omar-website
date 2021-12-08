const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'app', 'index'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      rules: [{
        test: /.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/react"],
          plugins: [
            'styled-components'
          ]
        }
      },{
        test: /.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/react", "@babel/preset-typescript"],
          plugins: [ 'styled-components' ]
        }
      },
        {test: [/.glb$/, /.fbx$/], loader: "arraybuffer-loader"},
        {test: [/.glsl$/], loader: "raw-loader"},
      { test: /.woff$/, loader: "url-loader" },
      {
        test: /.css$/,
        loader: ['style-loader', 'css-loader']
      }],
      include: [
        path.resolve(__dirname, 'app')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    title: "Omar Hefnawi",
    inject: true,
  })],
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.tsx', '.ts']
  },
}
