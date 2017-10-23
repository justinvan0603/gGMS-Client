const helpers           = require('./../helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'main': './src/desktop.ts'
  },

  target: 'electron',

  node: {
    __dirname: false
  },

  output: {
    path: helpers.root('build'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json','.css']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: 'awesome-typescript-loader'
      },
       {
        est: /\.css$/,
        use: ['raw-loader','style-loader', 'css-loader','to-string-loader'],
        include: [/node_modules/]
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: 'src/package.json'
    }])
  ]
};
