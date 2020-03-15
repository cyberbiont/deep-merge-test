const { expect } = require('chai')

const chalk = require('chalk')
const _ = require('lodash')

const mergersSetup = {
	// 🕮 <cyberbiont> 1214179c-21fe-4691-9afe-b3342a6e93bc.md
	'Object.assign': [Object.assign],
	'deep-extend': [require('deep-extend')],
	'jquery extend': [require('extend'), { jquery: true }],
	'webpack-merge': [require('webpack-merge')],
	// 'nested-config': [require('nested-config').mergeDeep],
	'_.merge': [_.merge],
	'_.assign': [_.assign],
	'_.defaults': [_.defaults],
	//! 🕮 <cyberbiont> 371cd416-ac09-4195-b587-c5bbd517e060.md
	'defaults': [require('defaults'), { reverse: true }],
	'merge-options': [require('merge-options')],
	'deepmerge': [require('deepmerge')],
}
Object.keys(mergersSetup).forEach(merger => {
	describe(`${merger} test`, () => {
		// 🕮 <cyberbiont> ad13b15a-525a-4dea-b298-6c95fb27653d.md
		test(...mergersSetup[merger])
	})
})
// 🕮 <cyberbiont> 10e41a8f-21c0-4532-89d7-6abc15fe69a5.md

function test(merger, o = {}) {
	function execute(...args) {
		if (o.reverse) args = args.reverse()
		if (o.spread) return { ...args[0], ...args[1], ...args[2] }
		if (o.jquery) args.unshift(true) // for deep merge
		return merger(...args)
	}

	// describe('merge test', () => {
	describe('deep merge', () => {
		// prepare arguments (test objects to merge)
		const srcSymbol = Symbol('src')
		const tgtSymbol = Symbol('tgt')

		const target = {
			undefinedProp: 'defined',
			nullProp: 'defined',
			fn: () => false, // functions are Option Values
			// promise: Promise.reject(new Error()),  // all non-plain objects are Option Values
			targetOnlyProperty: 'targetOnlyPropertyValue',
			[tgtSymbol]: 0,
			deepParent: {
				nested: {
					deepNestedToKeep: 123,
					deepNestedToOverride: 321,
				},
			},
			parent: {
				nestedToOverride: 'tgt',
				nestedToKeep: 'tgt',
			}, // {…} is plain, therefore an Option Object
			array: ['tgt'], // arrays are Option Values
			// 🕮 <cyberbiont> 03357f3a-ba62-41e9-8d6a-c4a3e64a5360.md
		}

		const src = {
			undefinedProp: undefined,
			nullProp: null,
			fn: () => true,
			promise: Promise.resolve('src'),
			[srcSymbol]: 1,
			parent: {
				nestedToOverride: 'src',
				nestedToAdd: 'src',
			},
			deepParent: {
				nested: {
					deepNestedToOverride: 'src',
				},
			},
			array: ['src'],
			// 🕮 <cyberbiont> 1180fea8-16d9-43de-9859-fe135678075a.md
		}

		// commence test
		let result
		try {
			result = execute(target, src)
		} catch (err) {
			console.error(err)
		}

		// console.log(result)

		it('should handle promises', () => {
			// expect(Promise.resolve(result.promise)).to.equal(result.promise);
			// expect(result.promise).to.be.an.instanceof(Promise);
			expect(result.promise).to.be.a('promise')
		})

		it('should handle functions', () => {
			expect(result.fn).to.be.a('function')
		})

		it('should handle Symbols', () => {
			expect(result[srcSymbol], 'hmm, Symbols are not supported').to.equal(1)
		})

		it('should not merge "undefined" value over defined', () => {
			expect(result.undefinedProp).to.equal('defined')
		})

		it('should merge "null" value over defined', () => {
			expect(result.nullProp).to.be.a.null
		})

		it('should handle nested objects', () => {
			expect(result).to.have.nested.property('parent.nestedToKeep')
			// 🕮 <cyberbiont> 4658aaf0-b6e2-43e0-8dd0-604f7cc2b569.md
			expect(result.deepParent).to.eql({
				nested: { deepNestedToKeep: 123, deepNestedToOverride: 'src' },
			})
		})

		it('should merge arrays with replacement strategy', () => {
			expect(result.array).to.be.an('array')
			expect(result.array).to.eql(['src'])
		})
	})

	describe('inherited and non-enumerable properties test', () => {
		const src = Object.create(
			{ inherited: 'src' }, // prototype property
			{
				isNotEnumerable: {
					value: 'src', // own non-enumerable property
				},
				isEnumerable: {
					value: 'src',
					enumerable: true, // own enumerable property
				},
			},
		)

		const args = [{}, src]
		const result = execute(...args)
		it('should copy inherited properties', () => {
			expect(
				result,
				'hmm, inherited properies are not copied',
			).to.have.property('inherited')
		})
		it('should copy non-enumerable properties', () => {
			// expect(result).to.have.property('isEnumerable');
			expect(result).to.have.property('isNotEnumerable')
		})
		// 🕮 <cyberbiont> 62aecf5e-82af-4848-8acb-89128a84aea4.md
	})

	describe('deep object immutability test', () => {
		const src = {
			a: 1,
			b: {
				c: 2,
			},
		}

		const result = execute({}, src)

		result.b.c = 30

		it('should not copy deep object properties by reference', () => {
			expect(result.b.c).to.equal(30)
			expect(src.b.c, 'hmm, deep properties are binded to original').to.equal(2)
		})
	})

	describe('arguments immutability test', () => {
		const o1 = { a: 1 }
		const o2 = { b: 2 }
		const o3 = { c: 3 }

		const result = execute(o1, o2, o2)

		it('should not copy object by reference (mutate argument object)', () => {
			expect(o1, 'hmm, last argument is mutated').to.eql({ a: 1 })
			expect(o2).to.eql({ b: 2 })
			expect(o3).to.eql({ c: 3 })
		})
	})

	describe('getters test', () => {
		const src = {
			get getterMethod() {
				return 'src'
			},
		}

		const result = execute({}, src)
		// console.info(src)
		// console.info(result)

		it('should copy getter function "as is"', () => {
			expect(result.getterMethod).to.exist
			expect(Object.getOwnPropertyDescriptor(result, 'getterMethod').get).to.not
				.be.undefined
		})
	})

	describe('copy prototype class methods', () => {
		class Test {
			constructor() {
				this.property = 'constructor property'
			}

			method() {
				return 'returned from class method'
			}
		}
		const instance = new Test()

		const result = execute(instance)
		// console.info(result)

		it('should copy prototype reference to parent class. class method must be present', () => {
			expect(result.method).to.exist
			expect(result.method).to.be.a('function')
		})
	})

	// 🕮 <cyberbiont> 781f99f3-3da6-43d9-9c73-88d4cbdd4340.md
}
