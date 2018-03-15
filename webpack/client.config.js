const webpack = require('webpack');
const config = require('sapper/webpack/config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssnext = require('postcss-cssnext');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

module.exports = {
	entry: config.client.entry(),
	output: config.client.output(),
	resolve: {
		extensions: ['.js', '.html'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						forceEnv: 'client'
					}
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							forceEnv: 'client'
						}
					},
					{
						loader: 'svelte-loader',
						options: {
							hydratable: true,
							emitCss: !isDev,
							cascade: false,
							store: true
						}
					}
				]
			},
			isDev && {
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: {
							minimize: false,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								cssnext()
							]
						}
					}
				]
			},
			!isDev && {
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true,
								sourceMap: false
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [
									cssnext()
								]
							}
						}
					]
				})
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				include: /node_modules/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'assets/[name].[ext]'
					}
				}
			}
		].filter(Boolean)
	},
	mode,
	plugins: [
		isDev && new webpack.HotModuleReplacementPlugin(),
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true,
			disable: isDev
		}),
		new webpack.DefinePlugin({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
	].filter(Boolean),
	devtool: isDev && 'inline-source-map'
};
