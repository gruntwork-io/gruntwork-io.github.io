const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const __DEV__ = process.env.NODE_ENV !== 'production';
const __PRODUCTION__ = !__DEV__;

const jekyllHost = 'http://localhost:4000'
const webpackHost = 'http://localhost:8080'

const entry = {
  main: `${__dirname}/source/sass/main.scss`,
  'index-page': `${__dirname}/source/js/index-page.js`,
  'contact-page': `${__dirname}/source/js/contact-page.js`,
  'infra-page': `${__dirname}/source/js/infra-page.js`,
};

const output = {
  path: path.join(__dirname, './'),
  publicPath: '/assets/',
  filename: 'js/[name].js',
  hotUpdateChunkFilename: 'assets/[id].[hash].hot-update.js',
  hotUpdateMainFilename: 'assets/[hash].hot-update.json'
};

const sassLoader = {
  test: /\.scss$/,
  include: `${__dirname}/source/sass`,
};

if (__DEV__) {
  sassLoader.use = [
    {
      loader: 'style-loader'
    },
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
  ];
} else {
  sassLoader.use = ExtractTextPlugin.extract({
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
  });
}

const fontsLoader = {
  test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'file-loader',
  options: {
    publicPath: `${__DEV__ ? webpackHost : ''}/assets/fonts/`,
    outputPath: 'fonts/'
  }
};

const svgLoader = {
  test: /\.svg$/,
  loader: 'file-loader',
  options: {
    publicPath: `${__DEV__ ? webpackHost : ''}/assets/img/`,
    outputPath: 'img/'
  }
};

const plugins = [
  new webpack.optimize.CommonsChunkPlugin('init')
]

if (__PRODUCTION__) {
  plugins.push(new ExtractTextPlugin({
    filename: 'css/style.css',
    allChunks: true,
  }));
}

module.exports = {
  entry: entry,
  output: output,
  module: {
    rules: [
      sassLoader,
      fontsLoader,
      svgLoader
    ],
  },
  plugins: plugins,
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hotOnly: true,
    publicPath: '/assets/',
    contentBase: '/',
    proxy: {
      "**": `${jekyllHost}`
    },
    host: '0.0.0.0'
  },
};
