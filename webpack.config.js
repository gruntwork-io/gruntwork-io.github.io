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
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          publicPath: '/assets/fonts/',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
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
  ],
  devtool: 'eval-cheap-module-source-map',
};
