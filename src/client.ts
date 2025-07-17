import {
    ChainRestBankApi,
    MsgBroadcasterWithPk,
    MsgSend,
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { InjectiveWallet } from './wallet';
import { Utils } from './utils';

export type InjectiveClientOptions = {
    network?: Network
    wallet: InjectiveWallet
    bankApi?: ChainRestBankApi
    broadcaster?: MsgBroadcasterWithPk
}

export class InjectiveClient {
    private bankApi: ChainRestBankApi
    private broadcaster: MsgBroadcasterWithPk
    private wallet: InjectiveWallet
    public network: Network

    /**
     * Creates an instance of InjectiveClient.
     * @param {InjectiveClientOptions} options - The options for the client.
     * @param {Network} [options.network] - The network to connect to. Defaults to Testnet.
     * @param {InjectiveWallet} options.wallet - The wallet to use for transactions.
     * @param {ChainRestBankApi} [options.bankApi] - The bank API to use. Defaults to the Testnet bank API.
     * @param {MsgBroadcasterWithPk} [options.broadcaster] - The broadcaster to use for sending messages. Defaults to a broadcaster with the provided wallet's private key.
     */
    constructor(options: InjectiveClientOptions) {
        this.network = options.network || Network.Testnet
        this.wallet = options.wallet
        this.bankApi = options.bankApi || new ChainRestBankApi(getNetworkEndpoints(Network.Testnet).rest)
        this.broadcaster = options.broadcaster || new MsgBroadcasterWithPk({ network: this.network, privateKey: this.wallet.privateKey })
    }

    /**
     * Fetches the balance of a given address.
     * @param {string} address - The address to fetch the balance for.
     * @param {string} [denomination] - The denomination of the balance to fetch. Defaults to 'inj'.
     * @returns {Promise<string>} The balance amount as a string.
     */
    async getAddressBalance(address: string, denomination: string = 'inj'): Promise<string> {
        if (!Utils.isValidAddress(address)) {
            throw new Error(`Invalid Injective address, got: ${address}`)
        }
        const balance = await this.bankApi.fetchBalance(address, denomination)
        return balance.amount
    }

    /**
     * Fetches the balance of the wallet's address.
     * @param {string} [denomination] - The denomination of the balance to fetch. Defaults to 'inj'.
     * @returns {Promise<string>} The balance amount as a string.
     */
    async getWalletBalance(denomination?: string): Promise<string> {
        return this.getAddressBalance(this.wallet.address, denomination)
    }

    /**
     * Sends tokens from the wallet to a specified address.
     * @param {string} toAddress - The address to send tokens to.
     * @param {string} amount - The amount of tokens to send.
     * @param {string} [denomination] - The denomination of the tokens. Defaults to 'inj'.
     * @returns {Promise<string>} The transaction hash of the sent transaction.
     */
    async sendTokens(toAddress: string, amount: string, denomination: string = 'inj'): Promise<string> {
        if (!Utils.isValidAddress(toAddress)) {
            throw new Error(`Invalid Injective address, got: ${toAddress}`)
        }
        if (!Utils.isValidAmount(amount)) {
            throw new Error(`Invalid amount, got: ${amount}`)
        }
        const msg = MsgSend.fromJSON({
            amount: {
                amount,
                denom: denomination,
            },
            srcInjectiveAddress: this.wallet.address,
            dstInjectiveAddress: toAddress,
        })

        const response = await this.broadcaster.broadcast({
            msgs: [msg],
        })

        return response.txHash
    }
}
