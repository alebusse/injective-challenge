import assert from 'assert/strict'
import { PrivateKey } from '@injectivelabs/sdk-ts'
import { InjectiveWallet } from '../src/wallet'
import { Utils } from '../src/utils'

describe('InjectiveWallet', () => {
    it('should generate a wallet with mnemonic', () => {
        const wallet = InjectiveWallet.generate()

        assert.ok(wallet.privateKey)
        assert.ok(wallet.mnemonic)
        assert.ok(Utils.isValidMnemonic(wallet.mnemonic))
        assert.ok(wallet.address)
        assert.ok(Utils.isValidAddress(wallet.address))
        assert.ok(wallet.publicKeyHex)
        assert.ok(wallet.privateKeyHex)
        assert.ok(wallet.privateKey instanceof PrivateKey)
    })

    it('should create a wallet from mnemonic', () => {
        const mnemonic = 'student muffin clean pottery carry taste couple acid confirm spoil furnace gown'
        const address = 'inj1yk5jlvvnx0jxpza5vke8c882x4ku830sce8tus'
        const pub = '03f6ef969ce54cbb7d44101274407d3d25e62cc54d2e71ba4fef2560d4bca055a3'
        const prv = '0x36a2ce96a4e8c6495b9839e8546fbb913798a975bc813a1d907d278203ab9567'

        const wallet = InjectiveWallet.fromMnemonic(mnemonic)

        assert.strictEqual(wallet.mnemonic, mnemonic)
        assert.strictEqual(wallet.address, address)
        assert.strictEqual(wallet.publicKeyHex, pub)
        assert.strictEqual(wallet.privateKeyHex, prv)
    })

    it('should create a wallet from mnemonic with path', () => {
        const mnemonic = 'student muffin clean pottery carry taste couple acid confirm spoil furnace gown'
        const address = 'inj1ph6wqu6pyhmg5ysfzrgcz93yks7tytpfk7k4n6'
        const pub = '022935428e10e9614a2906cc3d6271f0b8c90ab5eee005656352bafd817fc6beb8'
        const prv = '0xb675d4cbf95d3d0dd0267b2442182bd1f38272494d6f60f4ebbb00e37303b7e7'

        const wallet = InjectiveWallet.fromMnemonic(mnemonic, 'm/1/2/3/0')

        assert.strictEqual(wallet.mnemonic, mnemonic)
        assert.strictEqual(wallet.address, address)
        assert.strictEqual(wallet.publicKeyHex, pub)
        assert.strictEqual(wallet.privateKeyHex, prv)
    })

    it('should create a wallet from private key', () => {
        const privateKeyHex = '0x36a2ce96a4e8c6495b9839e8546fbb913798a975bc813a1d907d278203ab9567'
        const address = 'inj1yk5jlvvnx0jxpza5vke8c882x4ku830sce8tus'

        const wallet = InjectiveWallet.fromPrivateKey(privateKeyHex)

        assert.strictEqual(wallet.privateKeyHex, privateKeyHex)
        assert.strictEqual(wallet.address, address)
        assert.ok(wallet.publicKeyHex)
    })

    it('should throw if mnemonic is not available', () => {
        const privateKeyHex = '0x36a2ce96a4e8c6495b9839e8546fbb913798a975bc813a1d907d278203ab9567'

        const wallet = InjectiveWallet.fromPrivateKey(privateKeyHex)

        assert.throws(() => wallet.mnemonic, /Mnemonic is not available/)
    })
})
