const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./src/controller.js'],
	devtool: 'inline-source-map',
	 devServer: {
     contentBase: './dist'
   },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};