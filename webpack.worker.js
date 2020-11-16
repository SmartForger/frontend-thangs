const path = require('path')

module.exports = {
  entry: {
    upload: path.resolve(__dirname, './src/workers/upload.js'),
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
    path: path.resolve(__dirname, './public/workers'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist/workers'),
  },
}
