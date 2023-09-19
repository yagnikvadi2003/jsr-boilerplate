const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const port = process.env.PUBLIC_URL ? parseInt(process.env.PUBLIC_URL, 10) : 3003;

module.exports = merge(common, {
	devtool: "inline-source-map",
	mode: "development",
	devServer: {
		port: port // Set your desired port here
	}
});
