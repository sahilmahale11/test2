module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],

		'@typescript-eslint/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					'{}': true,
				},
			},
		],
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/no-empty-function': 'warn',
		'import/extensions': ['off'],
		'no-async-promise-executor': 'off',
		'no-extra-semi': ['off'],
		'no-multi-spaces': ['error'],
		'no-underscore-dangle': ['off'],
		'no-console': 'error',
		'no-unused-vars': 'off',
		'class-methods-use-this': ['off'],
		'max-len': ['warn', { code: 180, ignoreComments: true }],
		semi: ['error', 'always'],
		strict: ['error', 'global'],
		indent: [
			'error',
			4,
			{
				SwitchCase: 1,
				ignoredNodes: ['ConditionalExpression'],
				offsetTernaryExpressions: true,
			},
		],
		quotes: ['error', 'single'],
		'no-duplicate-imports': 'error',
		'no-empty-pattern': 'off',
	},
};
