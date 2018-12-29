const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
/* global __dirname */

module.exports = {
  entry: {
    'html5-skin': ['./js/index.js', './scss/html5-skin.scss'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].min.js',
  },
  resolve: { extensions: ['.js', '.jsx', '.json'] },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-react-jsx',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'head',
    }),
    new CopyWebpackPlugin([
      { from: 'assets/**/*' },
      { from: 'iframe.html' },
      { from: 'amp_iframe.html' },
    ]),
    new MiniCssExtractPlugin({
      filename: 'html5-skin.min.css',
      publicPath: '/build',
    }),
  ],
  devtool: 'source-map',
  devServer: {
    port: 4444,
    compress: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
