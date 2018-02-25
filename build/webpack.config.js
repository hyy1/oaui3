var path = require('path')
var webpack = require('webpack')
var htmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

var ROOT_PATH = path.resolve(__dirname)
var APP_PATH = path.resolve(ROOT_PATH, '../src')
var BUILD_PATH = path.resolve(ROOT_PATH, '../dist')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    ui3: [APP_PATH + '/index.js'],
    iview: ['iview'],
    vue: ['vue', 'vuex', 'vue-router'],
    minlib: ['axios', 'moment'],
    lodash: ['lodash']
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/ui3/',
    filename: 'js/bundle-[name].js?v[hash:8]'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'vue/dist/vue.js',
      '@': resolve('src')
    }
  },

  module: {
    loaders: [
      { test: /(\.vue)$/, loader: 'vue-loader' },
      { test: /(\.js)$/, loader: 'babel-loader?presets[]=es2015,presets[]=stage-2', exclude: /node_modules/ },
      { test: /(\.js)$/, loader: 'eslint-loader', exclude: [/node_modules/] },
      { test: /(\.vue)$/, loader: 'eslint-loader', exclude: [/node_modules/] },
      // {test:/\.css$/,loader:'style-loader!css-loader'},//'style-loader!css-loader?modules=true'
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('', 'fonts/[name].[hash:7].[ext]')// utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new htmlPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new ExtractTextPlugin('css/styles.css?v[hash:8]'),
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'vue',
        'iview',
        'minlib',
        'lodash'
      ],
      minChunks: Infinity
    })
    // new webpack.BannerPlugin('版权所有，翻版必究'),
    // new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配ID
  ]
}
