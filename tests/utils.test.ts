import assert from 'assert/strict'
import * as bip39 from 'bip39'
import { Utils } from '../src/utils'

describe('Utils', () => {
    describe('isValidMnemonic', () => {
        it('should return true for a valid mnemonic', () => {
            const mnemonic = bip39.generateMnemonic()
            assert.equal(Utils.isValidMnemonic(mnemonic), true)
        })

        it('should return false for an invalid mnemonic', () => {
            const invalidMnemonic = 'invalid mnemonic phrase that is not valid'
            assert.equal(Utils.isValidMnemonic(invalidMnemonic), false)
        })
    })

    describe('isValidAddress', () => {
        it('should return true for a valid Injective address', () => {
            const validAddress = 'inj14krpnhzrxrr49lcucxxfskcvvmwcxldmhsz3al'
            assert.equal(Utils.isValidAddress(validAddress), true)
        })

        it('should return false for a non-Bech32 address', () => {
            const invalidAddress = 'not-a-valid-address'
            assert.equal(Utils.isValidAddress(invalidAddress), false)
        })

        it('should return false for a Bech32 address with wrong prefix', () => {
            const cosmosAddress = 'cosmos1nynns8ex9fq6sjjfjhx8n4g3t5s68rdsdp5gq5'
            assert.equal(Utils.isValidAddress(cosmosAddress), false)
        })
    })

    describe('isValidAmount', () => {
        it('should return true for a valid positive integer amount', () => {
            assert.strictEqual(Utils.isValidAmount('1'), true)
            assert.strictEqual(Utils.isValidAmount('123456789012345678901234567890'), true)
            assert.strictEqual(Utils.isValidAmount('   42   '), true)
        })

        it('should return false for a negative amount', () => {
            assert.strictEqual(Utils.isValidAmount('0'), false)
            assert.strictEqual(Utils.isValidAmount('-5'), false)
            assert.strictEqual(Utils.isValidAmount('3.14'), false) // BigInt doesn't support decimals
            assert.strictEqual(Utils.isValidAmount('abc'), false)
            assert.strictEqual(Utils.isValidAmount('123abc'), false)
            assert.strictEqual(Utils.isValidAmount(''), false)
            assert.strictEqual(Utils.isValidAmount(' '), false)
            assert.strictEqual(Utils.isValidAmount('1.0'), false)
            assert.strictEqual(Utils.isValidAmount('NaN'), false)
            assert.strictEqual(Utils.isValidAmount('Infinity'), false)
        })
    })
})
