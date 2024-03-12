const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false
  },
  mode: 'production',
  entry: './server.js',
  plugins: [
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "mykey.json"),
        },
      ],
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'final.js',
  },
  // externals: {
  //   '@google-cloud/storage': 'commonjs @google-cloud/storage'
  //   },
  target: 'node',
};