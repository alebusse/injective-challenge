import { PrivateKey, MsgBroadcasterWithPk, MsgSend } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { Utils } from './utils';

/**
     * Requests testnet funds from the Injective faucet.
     * @param {string} address - The Injective address to receive testnet funds.
     * @throws {Error} If the address is invalid or if the request fails.
     */
export async function requestTestnetFunds(address: string): Promise<void> {
    const FAUCET_MNEMONIC = 'indicate grace purchase ranch animal april unable tiny train exact secret west'

    if (!Utils.isValidAddress(address)) {
        throw new Error(`Invalid Injective address, got: ${address}`)
    }

    const faucetPrivateKey = PrivateKey.fromMnemonic(FAUCET_MNEMONIC)
    const faucetAddress = faucetPrivateKey.toAddress().toAccountAddress()
    console.log(`Requesting testnet funds for address: ${address} from faucet: ${faucetAddress}`)
    const msgBroadcaster = new MsgBroadcasterWithPk({ network: Network.Testnet, privateKey: faucetPrivateKey })
    const msg = new MsgSend({
        srcInjectiveAddress: faucetAddress,
        dstInjectiveAddress: address,
        amount: [{ denom: 'inj', amount: '110000000000000000' }] // 0.11 INJ
    })
    const response = await msgBroadcaster.broadcast({ msgs: msg })
    console.log(`Testnet funds requested successfully! Transaction Hash: ${response.txHash}`)
}