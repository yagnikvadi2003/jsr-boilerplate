const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
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
		// If you want to run it also in development set the optimization.minimize option to true
		minimize: true,
		minimizer: [
			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
			`...`,
			compiler => {
				const TerserPlugin = require("terser-webpack-plugin");
				new TerserPlugin({
					// sourceMap: false,
					parallel: true,
					terserOptions: {
						parse: {
							// We want terser to parse ecma 8 code. However, we don't want it
							// to apply any minification steps that turns valid ecma 5 code
							// into invalid ecma 5 code. This is why the 'compress' and 'output'
							// sections only apply transformations that are ecma 5 safe
							// https://github.com/facebook/create-react-app/pull/4234
							ecma: 2020
						},
						compress: {
							ecma: 2020,
							warnings: false,
							// Disabled because of an issue with Uglify breaking seemingly valid code:
							// https://github.com/facebook/create-react-app/issues/2376
							// Pending further investigation:
							// https://github.com/mishoo/UglifyJS2/issues/2011
							comparisons: false,
							// Disabled because of an issue with Terser breaking valid code:
							// https://github.com/facebook/create-react-app/issues/5250
							// Pending further investigation:
							// https://github.com/terser-js/terser/issues/120
							inline: 2
						},
						mangle: {
							safari10: true
						},
						// Added for profiling in devtools
						// keep_classnames: isEnvProductionProfile,
						// keep_fnames: isEnvProductionProfile,
						output: {
							ecma: 2020,
							comments: false,
							// Turned on because emoji and regex is not minified properly using default
							// https://github.com/facebook/create-react-app/issues/2488
							ascii_only: true
						}
					}
				}).apply(compiler);
			},
			new CssMinimizerPlugin({
				minimizerOptions: {
					parallel: 4,
					minify: CssMinimizerPlugin.cleanCssMinify,
					preset: [
						"default",
						{
							discardComments: { removeAll: true }
						}
					]
				}
			})
		],
		runtimeChunk: true,
		splitChunks: {
			cacheGroups: {
				default: false,
				vendors: false,
				chunks: "all",
				minSize: "20000",
				maxInitialRequests: "30",
				maxAsyncRequests: "30",
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](?:(@[\w-]*?[\\/].*?|.*?)([\\/]|$))/
						);

						if (packageName && packageName[1]) {
							// npm package names are URL-safe, but some servers don't like @ symbols
							return `npm.${packageName[1].replace("@", "")}`;
						}
					},
					priority: 20
				},
				react: {
					test: /[\\/]node_modules[\\/](@react|react|@react-dom|react-dom|@react-router-dom|react-router-dom)[\\/]/,
					name: "npm.react",
					enforce: true,
					chunks: "all",
					priority: 30
				},
				antd: {
					test: /[\\/]node_modules[\\/](@antd|antd)[\\/]/,
					name: "npm.antd",
					enforce: true,
					chunks: "all",
					priority: 31
				},
				materialui: {
					test: /[\\/]node_modules[\\/](@mui|@material-ui|material-ui)[\\/]/,
					name: "npm.materialui",
					enforce: true,
					chunks: "all",
					priority: 32
				},
				antdesign: {
					test: /[\\/]node_modules[\\/](@ant-design|ant-design)[\\/]/,
					name: "npm.antdesign",
					enforce: true,
					chunks: "all",
					priority: 33
				},
				tanstackReactTable: {
					test: /[\\/]node_modules[\\/](@tanstack|react-table)[\\/]/,
					name: "npm.tanstackReactTable",
					enforce: true,
					chunks: "all",
					priority: 34
				},
				reduxToolkit: {
					test: /[\\/]node_modules[\\/](@reduxjs|redux|@react-redux|react-redux|@redux-thunk|redux-thunk|@redux-saga|redux-saga)[\\/]/,
					name: "npm.reduxToolkit",
					enforce: true,
					chunks: "all",
					priority: 35
				},
				reacthookform: {
					test: /[\\/]node_modules[\\/](@react-hook-form|react-hook-form)[\\/]/,
					name: "npm.reacthookform",
					enforce: true,
					chunks: "all",
					priority: 36
				},
				reactpdf: {
					test: /[\\/]node_modules[\\/](@react-pdf|react-pdf)[\\/]/,
					name: "npm.reactpdf",
					enforce: true,
					chunks: "all",
					priority: 37
				},
				styleComponents: {
					test: /[\\/]node_modules[\\/](@styled-components|styled-components)[\\/]/,
					name: "npm.styledComponents",
					enforce: true,
					chunks: "all",
					priority: 38
				},
				reactToastify: {
					test: /[\\/]node_modules[\\/](@react-toastify|react-toastify)[\\/]/,
					name: "npm.reactToastify",
					enforce: true,
					chunks: "all",
					priority: 39
				},
				xlsx: {
					test: /[\\/]node_modules[\\/](@xlsx|xlsx)[\\/]/,
					name: "npm.xlsx",
					enforce: true,
					chunks: "all",
					priority: 40
				},
				iconvlite: {
					test: /[\\/]node_modules[\\/](@iconv-lite|iconv-lite)[\\/]/,
					name: "npm.iconvlite",
					enforce: true,
					chunks: "all",
					priority: 41
				},
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
	plugins: [
		new CompressionPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].[fullhash].css",
			chunkFilename: "[id].[fullhash].css"
		})
	],
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	}
});
