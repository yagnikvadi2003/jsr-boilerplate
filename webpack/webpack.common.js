const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const devMode = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging";

/* dotenv */
const dotenv = require("dotenv");
const fs = require("fs");

const currentPath = path.join(__dirname, "..");
// Create the fallback path (the development .env)
const basePath = currentPath + "/.env";
const envPath = basePath + "." + process.env.NODE_ENV;
// Check if the file exists, otherwise fall back to the production .env
const finalPath = fs.existsSync(envPath) ? envPath : basePath;

// Set the path parameter in the dotenv config
const fileEnv = dotenv.config({ path: finalPath }).parsed;

// call dotenv and it will return an Object with a parsed key
// reduce it to a nice object, the same as before (but with the variables from the file)
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
	return prev;
}, {});

const htmlWebpackPlugin = new HtmlWebPackPlugin({
	template: path.resolve(__dirname, "../public/index.html"),
	filename: "index.html",
	title: "boilerplate"
});

module.exports = {
	entry: path.resolve(__dirname, "../src/main.jsx"),
	output: {
		path: path.join(__dirname, "../dist"),
		filename: "[name].[hash].js",
		chunkFilename: "[name].[chunkhash].js"
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "html-loader",
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				include: [path.resolve(__dirname, "src"), path.resolve(__dirname, "web")],
				use: [devMode ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.s?[ac]ss$/,
				use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: "style-loader" // creates style nodes from JS strings
					},
					{
						loader: "css-loader" // translates CSS into CommonJS
					},
					{
						loader: "less-loader" // compiles Less to CSS
					}
				]
			},
			// {
			// 	test: /\.svg$/,
			// 	use: [
			// 		{
			// 			loader: require.resolve("@svgr/webpack"),
			// 			options: {
			// 				prettier: false,
			// 				svgo: false,
			// 				svgoConfig: {
			// 					plugins: [{ removeViewBox: false }]
			// 				},
			// 				titleProp: true,
			// 				ref: true
			// 			}
			// 		},
			// 		{
			// 			loader: require.resolve("file-loader"),
			// 			options: {
			// 				name: "static/media/[name].[hash].[ext]"
			// 			}
			// 		}
			// 	],
			// 	issuer: {
			// 		and: [/\.(js|jsx|md|mdx)$/]
			// 	}
			// },
			// {
			// 	test: /\.svg$/,
			// 	use: {
			// 		loader: "svg-url-loader"
			// 	}
			// },
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: "file-loader",
				options: {
					name: devMode ? "[path][name].[ext]" : "[contenthash].[ext]"
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "fonts/"
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ["*", ".js", ".jsx"]
	},
	plugins: [
		new CleanWebpackPlugin(),
		htmlWebpackPlugin,
		new MiniCssExtractPlugin({
			filename: devMode ? "[name].css" : "[name].[hash].css",
			chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "../public/index.html"),
					to: path.resolve(__dirname, "../public/index.html")
				}
			],
			options: {
				concurrency: 100
			}
		}),
		new webpack.DefinePlugin(
			devMode
				? {
						"process.env": {
							NODE_ENV: JSON.stringify("development"),
							REACT_APP_API_BASE: JSON.stringify(process.env.REACT_APP_API_BASE)
						}
				  }
				: envKeys
		)
	],
	devServer: {
		historyApiFallback: true
	}
};
