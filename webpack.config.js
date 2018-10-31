const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ]

      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true
          }
        }
      }),
      new UglifyJsPlugin({
        sourceMap: true
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'head'
    }),
    new CopyWebpackPlugin([
      { from: 'assets/**/*' },
      { from: 'iframe.html' },
      { from: 'amp_iframe.html'}
    ]),
    new MiniCssExtractPlugin({
      filename: 'html5-skin.min.css',
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
