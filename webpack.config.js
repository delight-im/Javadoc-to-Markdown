const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');

const defaultConfig = {
    name: 'Uncompressed JavadocToMarkdown',
    entry: './src/javadoc-to-markdown.js',
    output: {
      path: path.join(__dirname, '_js'),
      filename: 'javadoc-to-markdown.js',
      libraryTarget: "var",
      library: "JavadocToMarkdown"
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin()
    ],
    module: {
      loaders: [
          {
            test: /\.(js)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                plugins: [
                    'lodash'
                ]
            }
        }
      ]
    }
  };

var minifedLib = _.merge({}, defaultConfig, {
    name: 'Minified JavadocToMarkdown',
    output: {
      filename: 'javadoc-to-markdown.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        minimize: true,
        sourceMap: false,
        output: {
          comments: false
        },
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true,
          warnings: false
        }
      })
    ]
});

module.exports = [
  defaultConfig,
  minifedLib
];