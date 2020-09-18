const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const helpers = require('./webpack.helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  entry: helpers.getEntry(),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    filename: 'js/[name].js',
  },
  devServer: {
    host: '0.0.0.0',
    port: 1234,
    disableHostCheck: true,
    overlay: true,
    inline: true,
    compress: false,
    after(app, server) {
      console.log('Dev-server: ', `http://${server.options.host}:${server.options.port}/`);
      console.log('Local network', `http://192.168.88.17:${server.options.port}/`);
    },
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/css',
              outputPath: 'css',
              name(resourcePath) {
                if (/(font|node_modules)/.test(resourcePath)) {
                  return '[name].css';
                }
                return '[name].[hash].css';
              },
              esModule: false,
            },
          },
          'extract-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [postcssPresetEnv()],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-template-loader',
            query: {
              parseDynamicRoutes: true,
              attributes: ['img:src', 'x-img:src', 'link:href'],
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ["@babel/plugin-proposal-class-properties"]
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
              esModule: false,
              attrs: ['img:src', 'img:data-src', 'link:href'],
            },
          },
        ],
      },
      {
        test: /\.(webmanifest|xml|ico|txt)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'public',
              publicPath: '/public',
              name: '[name].[ext]',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/assets/fonts/',
              outputPath: 'assets/fonts/',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, helpers.src.STATIC), to: '../dist/static' },
    ]),
  ],
};
