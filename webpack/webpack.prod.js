const { merge } = require("webpack-merge");

const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
	// node: {
	// 	module: "empty",
	// 	dgram: "empty",
	// 	dns: "mock",
	// 	fs: "empty",
	// 	http2: "empty",
	// 	net: "empty",
	// 	tls: "empty",
	// 	child_process: "empty",
	// 	__dirname: true,
	// 	__filename: true,
	// 	global: true
	// },
	stats: {
		colors: true,
		hash: true,
		timings: true,
		assets: true,
		chunks: true,
		chunkModules: true,
		modules: true,
		children: true
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					sourceMap: false
				}
			}),
			new OptimizeCSSAssetsPlugin({})
		],
		runtimeChunk: false,
		splitChunks: {
			cacheGroups: {
				default: false,
				vendors: false,
				chunks: "all",
				minSize: "0",
				maxInitialRequests: "20",
				maxAsyncRequests: "20",
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
						)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace("@", "")}`;
					},
					priority: 20
				},
				react: {
					test: /[\\/]node_modules[\\/](@react|react)[\\/]/,
					name: "npm.react",
					enforce: true,
					chunks: "all",
					priority: 30
				},
				materialui: {
					test: /[\\/]node_modules[\\/](@material-ui|@mui|material-ui)[\\/]/,
					name: "npm.materialui",
					enforce: true,
					chunks: "all",
					priority: 31
				},
				// common chunk
				common: {
					name: "common",
					minChunks: 2,
					chunks: "async",
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				}
			}
		}
	},
	plugins: [new CompressionPlugin()]
});
