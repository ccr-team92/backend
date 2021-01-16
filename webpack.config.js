const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: 'node',
  entry: slsw.lib.entries,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};