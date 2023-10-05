module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended"
	],
	overrides: [
		// override "simple-import-sort" config
		// https://dev.to/julioxavierr/sorting-your-imports-with-eslint-3ped
		{
			files: ["*.js", "*.jsx"],
			rules: {
				"simple-import-sort/imports": [
					"error",
					{
						groups: [
							// Node.js builtins. You could also generate this regex if you use a `.js` config.
							// For example: `^(${require("module").builtinModules.join("|")})(/|$)`
							// Note that if you use the `node:` prefix for Node.js builtins,
							// you can avoid this complexity: You can simply use "^node:".
							[
								"^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)"
							],
							// Packages. `react` related packages come first.
							["^react", "@reduxjs", "^(@mui)(/.*|$)", "^(@ant-design)(/.*|$)"], //, '^@?\\w'
							// Packages.
							// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
							["^\\w"],
							// Anything not matched in another group.
							["^"],
							// Relative imports.
							// Anything that starts with a dot.
							["^\\."],
							// Internal packages.
							// dx ['^(@|@company|@mui|@ui|components|utils|config|vendored-lib)(/.*|$)'],
							// Side effect imports.
							// dx ['^\\u0000'],
							// Parent imports. Put `..` last.
							//dx ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
							// Other relative imports. Put same-folder imports and `.` last.
							//dx ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
							// Style imports.
							["^.+\\.s?css$"]
						]
					}
				]
			}
		}
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		ecmaFeatures: {
			jsx: true
		},
		project: "./tsconfig.json"
	},
	plugins: [
		"prettier",
		"react",
		"react-hooks",
		"@typescript-eslint",
		"simple-import-sort",
		"import"
	],
	rules: {
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
		],
		"prettier/prettier": "error",
		"react/jsx-filename-extension": [
			1,
			{
				extensions: [".jsx"]
			}
		],
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
		"import/first": "error",
		"import/no-duplicates": "error",
		"import/newline-after-import": "error",
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"no-duplicate-imports": "error",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		"react/jsx-uses-react": "off",
		"@typescript-eslint/no-unused-vars": ["error"],
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/typedef": [
			"error",
			{
				parameter: true,
				propertyDeclaration: true
			}
		]
	},
	settings: {
		react: {
			version: "18.x"
		},
		typescript: {
			version: "5.x"
		},
		node: {
			version: "18.x"
		},
		npm: {
			version: "9.x"
		}
	},
	ignorePatterns: ["node_modules", "build", "dist", "public"]
};
