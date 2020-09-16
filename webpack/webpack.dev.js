const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const helpers = require('./webpack.helpers');

module.exports = (env) => {
  return merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.(png|jp(e*)g|svg|gif)$/,
          use: [helpers.useFileLoaderImage()],
        },
      ],
    },
    plugins: [
      ...helpers.templatePlugin({ minify: false }),
    ],
  });
};
