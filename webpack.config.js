const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: `${__dirname}/source/sass/main.scss`,
    'index-page': `${__dirname}/source/js/index-page.js`,
    'contact-page': `${__dirname}/source/js/contact-page.js`,
    'infra-page': `${__dirname}/source/js/infra-page.js`,
  },
  output: {
    path: path.join(__dirname, './assets/'),
    publicPath: '/',
    filename: 'js/[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: function () {
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }),
        include: `${__dirname}/source/sass`,
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          publicPath: '/assets/fonts/',
          outputPath: 'fonts/'
        }
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/style.css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin('init')
  ],
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    inline: true,
    proxy: {
      "**": "http://localhost:4000"
    },
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
};
