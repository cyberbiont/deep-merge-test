module.exports = {
	// roots: ['<rootDir>/src'],
	testMatch: ['**/*(*.)+(spec|test).+(ts|tsx|js)'],
	reporters: [
		'default',
		[
			'jest-stare',
			{
				resultDir: 'tmp/reporters/jest-stare',
				reportTitle: 'jest-stare!',
				// 🕮 <cyberbiont> 535ad251-bc17-4fa2-8d1d-45bd9e5b4c9c.md
			},
		],
	],
	watchPathIgnorePatterns: ['.*jest-stare.*\\.js'],
}
