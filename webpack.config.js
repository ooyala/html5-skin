const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './js/controller.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'html5-skin.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'sample.html',
      inject: 'head'
    })
  ],
  devtool: 'source-map',
  devServer: {
    port: 4444,
    compress: true,
    open: true
  },
  node: {
    fs: "empty"
  }
};
