const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { NODE_ENV: ENV } = process.env;
const isProduction = ENV === 'production';

const libraryName = 'liburnasional';

const config = {
  entry: `${__dirname}/src/liburnasional.js`,
  target: 'node',
  node: {
    process: false,
  },
  mode: ENV || 'development',
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: `${libraryName.toLowerCase()}${isProduction ? '.min' : ''}.js`,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    modules: [__dirname, `${__dirname}/src`, 'node_modules'],
    extensions: ['*', '.js'],
  },
  plugins: [
    ...(isProduction ? [new UglifyJsPlugin({
      sourceMap: true,
    })] : []),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

module.exports = config;
