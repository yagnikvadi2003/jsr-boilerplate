module.exports = {
	root: true,
	env: { browser: true, es2020: true, Node: true },
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"plugin:jsx-a11y/recommended",
		"prettier/babel"
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		sourceType: "module",
		requireConfigFile: false
	},
	settings: { react: { version: "18.2" } },
	plugins: ["react", "react-hooks", "prettier", "jsx-a11y", "babel", "react-refresh"],
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		eqeqeq: ["error", "always"],
		"no-console": [
			"error",
			{
				allow: ["warn", "error"]
			}
		],
		"no-warning-comments": [
			"error",
			{
				decoration: ["/", "*"]
			}
		]
	},
	"prettier/prettier": "error",
	"multiline-comment-style": ["error", "starred-block"],
	"no-eq-null": "error",
	"no-extra-semi": "error",
	"no-redeclare": "error",
	"no-regex-spaces": "error",
	"spaced-comment": ["error", "always"],
	"arrow-spacing": "error",
	"brace-style": "error",
	"operator-assignment": ["error", "always"],
	"comma-spacing": ["error", { before: false, after: true }],
	"computed-property-spacing": ["error", "never"],
	"no-duplicate-case": "error",
	"require-await": "error",
	"no-dupe-keys": "error",
	"no-dupe-args": "error",
	curly: "error",
	camelcase: "error",
	"no-duplicate-imports": "error",
	"react-hooks/rules-of-hooks": "error",
	"react-hooks/exhaustive-deps": "warn"
};
