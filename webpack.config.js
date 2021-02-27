const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env = {}) => {
  env.production = env.production || false;

  return {
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(env),
      new ESLintPlugin({
        context: 'src/',
      }),
    ],
    target: 'browserslist',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            ecma: 2016,
            compress: true,
            mangle: true,
            module: true,
            sourceMap: true,
          },
        }),
      ],
    },
    entry: function () {
      const entries = {};
      const files = glob.sync('./src/components/*/*.js', {
        ignore: ['./src/components/*/*.test.js'],
      });

      files.forEach((file) => {
        entries[file.split('/')[file.split('/').length - 1]] = file;
      });

      return entries;
    },
    experiments: {
      outputModule: true,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]',
      publicPath: '/',
      module: true,
      environment: {
        forOf: true,
        destructuring: true,
        const: true,
        arrowFunction: true,
      },
    },
    devServer: {
      contentBase: path.join(__dirname, 'src'),
      publicPath: '/',
      compress: true,
      index: 'index.html',
      port: 8888,
      watchContentBase: true,
      open: true,
    },
    devtool: 'source-map',
    module: {
      rules: [
        //#region html rule
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        //#endregion

        //#region sass rule
        {
          test: /\.s[ac]ss$/i,
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [path.resolve(__dirname, 'src/scss')],
                },
              },
            },
          ],
        },
        //#endregion
      ],
    },
  };
};
