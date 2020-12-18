const path = require('path')

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/workers/index.js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  output: {
    path: path.resolve(__dirname, './build/workers'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist/workers'),
  },
}
