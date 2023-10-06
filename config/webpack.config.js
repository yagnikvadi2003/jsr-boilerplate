const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	devtool: "inline-source-map",
	mode: "development",
	devServer: {
		static: [path.join(__dirname, "..", "build")],
		open: true,
		compress: true,
		historyApiFallback: true
	}
});
