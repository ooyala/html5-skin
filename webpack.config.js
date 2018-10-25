const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'html5-skin': ['./js/controller.js', './scss/html5-skin.scss']
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'sass-loader'
          },
        ]

      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'sample.html',
      inject: 'head'
    }),
    new CopyWebpackPlugin([
      { from: 'assets/**/*' },
      { from: 'iframe.html' },
      { from: 'amp_iframe.html'}
    ]),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      publicPath: '/build',
    })
  ],
  devtool: 'source-map',
  devServer: {
    port: 4444,
    compress: true,
    open: true
  }
};
