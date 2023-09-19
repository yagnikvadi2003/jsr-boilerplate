import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const port = process.env.PUBLIC_URL ? parseInt(process.env.PUBLIC_URL, 10) : 3003;
const preview_port = process.env.PREVIEW_URL ? parseInt(process.env.PREVIEW_URL, 10) : 3002;
const api_base = process.env.REACT_APP_API_BASE
	? process.env.REACT_APP_API_BASE
	: "http://127.0.0.1:3003";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: port,
		origin: api_base,
		open: "./public/index.html",

		// This is the default value, and will add all files with node_modules
		// in their paths to the ignore list.
		sourcemapIgnoreList(sourcePath, _sourcemapPath) {
			return sourcePath.includes("node_modules");
		}
	},
	preview: {
		port: preview_port
	}
});
