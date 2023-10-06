const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getPublicUrlOrPath = require("react-dev-utils/getPublicUrlOrPath");

const paths = require("./paths");
const modules = require("./modules");
const getClientEnvironment = require("./env");

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const isEnvDevelopment =
	process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging";
const isEnvProduction = process.env.NODE_ENV === "production";

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || "10000");

// Check if JavaScript is setup
const useJavaScript = fs.existsSync(paths.appJsConfig);

// // Check if Tailwind config exists
// const useTailwind = fs.existsSync(path.join(paths.appPath, 'tailwind.config.js'));

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> href into HTML even in
// single-page apps that may serve index.html for nested URLs like /todo/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todo/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
	process.env.NODE_ENV === "development",
	require(paths.resolveApp("package.json")).homepage,
	process.env.PUBLIC_URL
);

const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

module.exports = {
	// These are the "entry points" to our application.
	// This means they will be the "root" imports that are included in JS bundle.
	entry: paths.appIndexJs,
	output: {
		// The build folder.
		path: paths.appBuild,
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: isEnvDevelopment,
		filename: "[name].[fullhash].js",
		chunkFilename: "[name].[chunkhash].js",
		clean: true,
		publicPath: publicUrlOrPath
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				// "oneOf" will traverse all following loaders until one will
				// match the requirements. When no loader matches it will fall
				// back to the "file" loader at the end of the loader list.
				oneOf: [
					// TODO: Merge this config once `image/avif` is in the mime-db
					// https://github.com/jshttp/mime-db
					{
						test: [/\.avif$/],
						type: "asset",
						mimetype: "image/avif",
						parser: {
							dataUrlCondition: {
								maxSize: imageInlineSizeLimit
							}
						}
					},
					// "url" loader works like "file" loader except that it embeds assets
					// smaller than specified limit in bytes as data URLs to avoid requests.
					// A missing `test` is equivalent to a match.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						type: "asset",
						parser: {
							dataUrlCondition: {
								maxSize: imageInlineSizeLimit
							}
						}
					},
					{
						test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, //|svg
						use: [
							{
								loader: "file-loader",
								options: {
									name: "[name].[ext]",
									outputPath: "fonts/"
								}
							}
						]
					},
					{
						test: /\.svg$/,
						use: [
							{
								loader: require.resolve("@svgr/webpack"),
								options: {
									prettier: false,
									svgo: false,
									svgoConfig: {
										plugins: [{ removeViewBox: false }]
									},
									titleProp: true,
									ref: true
								}
							},
							{
								loader: require.resolve("file-loader"),
								options: {
									name: "static/media/[name].[hash].[ext]"
								}
							}
						],
						issuer: {
							and: [/\.(ts|js|jsx|md|mdx)$/]
						}
					},
					{
						test: /\.svg$/,
						use: {
							loader: "svg-url-loader"
						}
					},
					{
						test: /\.(jpe?g|png|gif)$/i,
						loader: "file-loader",
						options: {
							name: isEnvDevelopment ? "[path][name].[ext]" : "[contenthash].[ext]"
						},
						type: "asset/resource"
					},
					{
						test: /\.(js|jsx)$/,
						include: paths.appSrc,
						exclude: /node_modules/,
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env", "@babel/preset-react"],
							// This is a feature of `babel-loader` for webpack (not Babel itself).
							// It enables caching results in ./node_modules/.cache/babel-loader/
							// directory for faster rebuilds.
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,
							compact: isEnvProduction
						}
					},
					{
						test: /\.(ts)$/,
						include: paths.appSrc,
						exclude: /node_modules/,
						use: [
							{
								loader: "babel-loader",
								options: {
									presets: [
										"@babel/preset-env",
										"@babel/preset-react",
										"@babel/preset-typescript"
									],
									// This is a feature of `babel-loader` for webpack (not Babel itself).
									// It enables caching results in ./node_modules/.cache/babel-loader/
									// directory for faster rebuilds.
									cacheDirectory: true,
									// See #6846 for context on why cacheCompression is disabled
									cacheCompression: false,
									compact: isEnvProduction
								}
							},
							{
								loader: "ts-loader",
								options: {
									compilerOptions: {
										noEmit: false
									}
								}
							}
						]
					},
					{
						test: /\.html$/,
						exclude: /node_modules/,
						use: [
							{
								loader: "html-loader",
								options: { minimize: isEnvProduction }
							}
						]
					},
					{
						test: /\.css$/,
						include: paths.appSrc,
						use: [
							isEnvDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							}
						]
					},
					{
						test: /\.s?[ac]ss$/,
						use: [
							isEnvDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							}
						]
					},
					{
						test: /\.less$/,
						use: [
							{
								loader: "style-loader" // creates style nodes from JS strings
							},
							{
								loader: "css-loader" // creates style nodes from JS strings
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							},
							{
								loader: "less-loader", // compiles Less to CSS
								options: {
									sourceMap: isEnvProduction
										? shouldUseSourceMap
										: isEnvDevelopment
								}
							}
						]
					}
				]
			}
		]
	},
	resolve: {
		// This allows you to set a fallback for where webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebook/create-react-app/issues/253
		modules: ["node_modules", paths.appNodeModules].concat(modules.additionalModulePaths || []),
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebook/create-react-app/issues/290
		// `web` extension prefixes have been added for better support
		// for React Native Web.
		extensions: paths.moduleFileExtensions
			.map(ext => `.${ext}`)
			.filter(ext => useJavaScript || !ext.includes("js")),
		alias: {
			"@app": path.resolve(__dirname, "../src"),
			"@types": path.resolve(__dirname, "../src/types"),
			"@assets": path.resolve(__dirname, "../src/assets"),
			"@components": path.resolve(__dirname, "../src/components"),
			// "@contexts": path.resolve(__dirname, "../src/contexts"),
			// "@global": path.resolve(__dirname, "../src/global"),
			"@hooks": path.resolve(__dirname, "../src/hooks"),
			"@interface": path.resolve(__dirname, "../src/interface"),
			"@json": path.resolve(__dirname, "../src/json"),
			// "@layout": path.resolve(__dirname, "../src/layout"),
			// "@locales": path.resolve(__dirname, "../src/locales"),
			// "@pages": path.resolve(__dirname, "../src/pages"),
			// "@routes": path.resolve(__dirname, "../src/routes"),
			// "@store": path.resolve(__dirname, "../src/store"),
			// "@sections": path.resolve(__dirname, "../src/sections"),
			// "@services": path.resolve(__dirname, "../src/services"),
			// "@styles": path.resolve(__dirname, "../src/styles"),
			// "@themes": path.resolve(__dirname, "../src/themes"),
			// "@utils": path.resolve(__dirname, "../src/utils"),
			...(modules.webpackAliases || {})
		},
		plugins: [
			// Prevents users from importing files from outside of src/ (or node_modules/).
			// This often causes confusion because we only process files within src/ with babel.
			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
			// please link the files into your node_modules/ and let module-resolution kick in.
			// Make sure your source files are compiled, as they will not be processed in any way.
			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
		],
		fallback: {
			crypto: require.resolve("crypto-browserify"),
			stream: require.resolve("stream-browserify"),
			buffer: require.resolve("buffer")
		}
	},
	plugins: [
		new HtmlWebPackPlugin(
			Object.assign(
				{},
				{
					inject: true,
					template: paths.appHtml
				},
				isEnvProduction
					? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true
							}
					  }
					: undefined
			)
		),

		// Makes some environment variables available in index.html.
		// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
		// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
		// It will be an empty string unless you specify "homepage"
		// in `package.json`, in which case it will be the pathname of that URL.
		new InterpolateHtmlPlugin(HtmlWebPackPlugin, env.raw),

		new CopyPlugin({
			patterns: [
				{
					from: "public/favicon.svg",
					to: paths.appBuild
				},
				{ from: "public", to: "public" }
			],
			options: {
				concurrency: 100
			}
		}),
		new webpack.DefinePlugin(env.stringified),
		new webpack.ProvidePlugin({
			// Make a global `process` variable that points to the `process` package,
			// because the `util` package expects there to be a global variable named `process`.
			// Thanks to https://stackoverflow.com/a/65018686/14239942
			process: "process/browser.js",
			Buffer: ["buffer", "Buffer"]
		})
	]
};
