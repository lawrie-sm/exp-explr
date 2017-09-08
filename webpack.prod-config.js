const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['promise-polyfill', 'whatwg-fetch', './src/controller.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
	module: {
		loaders: [
			{
				test:/\.js$/,
				loader: 'babel-loader',
				query: { presets: ['env'] }
			}
		]
	},
	plugins: [ new UglifyJSPlugin()]
};