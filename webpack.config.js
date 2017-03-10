const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [
    `${__dirname}/source/sass/main.scss`,
  ],
  output: {
    path: path.join(__dirname, './assets/'),
    publicPath: '/',
    filename: 'js/build.js',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          }, 'sass-loader?outputStyle=expanded']
        }),
        include: `${__dirname}/source/sass`,
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        options: {
          publicPath: '/assets/fonts/',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
        options: {
          publicPath: '/assets/fonts/',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          publicPath: '/assets/fonts/',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
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
  ],
  devtool: 'eval-cheap-module-source-map',
};
