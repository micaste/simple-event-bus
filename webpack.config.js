module.exports = {
  entry: './index.js',
  module: {
    loaders: [
      {
        exclude: /(node_modules|test_resources)/,
        loader: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: true,
            plugins: ['transform-runtime'],
            presets: ['es2015'],
          },
        },
        test: /\.js$/,
      },
    ],
  },
  output: {
    filename: 'browser.js',
  },
  target: 'web',
};
