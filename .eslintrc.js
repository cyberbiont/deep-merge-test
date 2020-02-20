module.exports = {
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	extends: [
		'airbnb-base',
		'plugin:chai-friendly/recommended',
		'plugin:prettier/recommended', // disables rules that conflict with Prettier. Make sure to put it last in the extends array, so it gets the chance to override other configs.
	],
	plugins: ['jest'],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		'no-underscore-dangle': 'off',
		'no-shadow': 'off',
		'no-use-before-define': 'off',
		'func-names': 'off',
		'no-param-reassign': 'off',
		'global-require': 'off',
		'no-unused-vars': 'off',
		'no-console': 'off',
		'no-debugger': 'off',
		'class-methods-use-this': 'off',
		'dot-notation': 'off'
	}
};
