
import * as bip39 from 'bip39'
import { bech32 } from 'bech32'
import { BECH32_ADDR_ACC_PREFIX } from '@injectivelabs/sdk-ts'

export class Utils {


    /**
     * Validates a mnemonic phrase.
     * @param {string} mnemonic - The mnemonic phrase to validate.
     * @returns {boolean} True if the mnemonic is valid, false otherwise.
     */
    static isValidMnemonic(mnemonic: string): boolean {
        return bip39.validateMnemonic(mnemonic)
    }

    /**
     *  Validates if a given address is a valid Injective address.
     * @param {string} address - The address to validate.
     * @returns {boolean} True if the address is valid, false otherwise.
     */
    static isValidAddress(address: string): boolean {
        try {
            const decoded = bech32.decode(address, 1024)
            return decoded.prefix === BECH32_ADDR_ACC_PREFIX
        } catch (error) {
            return false
        }
    }

    /**
     * Validates if a given amount is a valid positive integer.
     * @param {string} amount - The amount to validate.
     * @returns {boolean} True if the amount is a valid positive integer, false otherwise.
     */
    static isValidAmount(amount: string): boolean {
        try {
            const trimmed = amount.trim()
            if (trimmed === '') return false

            const value = BigInt(trimmed)
            return value > 0n
        } catch {
            return false
        }
    }

}