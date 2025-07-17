import { PrivateKey } from '@injectivelabs/sdk-ts'

export class InjectiveWallet {
    private _privateKey: PrivateKey
    private _mnemonic?: string

    private constructor(prv: PrivateKey, mnemonic?: string) {
        this._privateKey = prv
        this._mnemonic = mnemonic
    }

    /**
     * Generates a new Injective wallet with a private key and mnemonic.
     * @returns {InjectiveWallet} The generated wallet instance.
     */
    static generate(): InjectiveWallet {
        const { privateKey, mnemonic } = PrivateKey.generate()
        return new InjectiveWallet(privateKey, mnemonic)
    }

    /**
     * Creates a wallet from a mnemonic phrase.
     * @param {string} mnemonic - The mnemonic phrase to create the wallet from.
     * @param {string} [path] - The HD derivation path (optional).
     * @returns {InjectiveWallet} The wallet instance created from the mnemonic.
     */
    static fromMnemonic(mnemonic: string, path?: string): InjectiveWallet {
        const prv = PrivateKey.fromMnemonic(mnemonic, path)
        return new InjectiveWallet(prv, mnemonic)
    }

    /**
     * Creates a wallet from a private key.
     * @param {string} privateKey - The private key to create the wallet from.
     * @returns {InjectiveWallet} The wallet instance created from the private key.
     */
    static fromPrivateKey(privateKey: string): InjectiveWallet {
        const prv = PrivateKey.fromHex(privateKey)
        return new InjectiveWallet(prv)
    }

    /**
     * Returns the address of the wallet.
     * @returns {string} The address in Bech32 format.
     */
    get address(): string {
        return this._privateKey.toAddress().toAccountAddress()
    }

    /**
     * Returns the public key in hexadecimal format.
     * @returns {string} The public key in hex format.
     */
    get publicKeyHex(): string {
        return this._privateKey.toPublicKey().toHex()
    }

    /**
     * Returns the private key in hexadecimal format.
     * @returns {string} The private key in hex format.
     */
    get privateKeyHex(): string {
        return this._privateKey.toPrivateKeyHex()
    }

    /**
     * Returns the private key of the wallet.
     * @returns {PrivateKey} The private key instance.
     */
    get privateKey(): PrivateKey {
        return this._privateKey
    }

    /**
     * Returns the mnemonic phrase of the wallet.
     * @returns {string} The mnemonic phrase.
     * @throws {Error} If the mnemonic is not available.
     */
    get mnemonic(): string {
        if (!this._mnemonic) {
            throw new Error('Mnemonic is not available for this wallet')
        }
        return this._mnemonic
    }
}
