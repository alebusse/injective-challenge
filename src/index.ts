import { InjectiveClient } from './client'
import { requestTestnetFunds } from './faucet'
import { InjectiveWallet } from './wallet'

async function main() {
    // generate wallet
    console.log('Generating Injective wallet...')
    const wallet = InjectiveWallet.generate()
    console.log('Wallet generated successfully!')
    console.log('Wallet Address:', wallet.address)
    console.log('Wallet Mnemonic:', wallet.mnemonic)
    console.log('Wallet Private Key:', wallet.privateKeyHex)
    console.log('Wallet Public Key:', wallet.publicKeyHex)

    // fund wallet with testnet funds
    console.log('Requesting testnet funds from the Injective faucet...')
    await requestTestnetFunds(wallet.address)

    // create Injective client
    const client = new InjectiveClient({
        wallet: wallet,
    })
    // fetch wallet balance
    const walletBalance = await client.getWalletBalance()
    console.log('Wallet Balance:', walletBalance + ' wei')

    // send tokens to another address
    const recipientAddress = 'inj1yk5jlvvnx0jxpza5vke8c882x4ku830sce8tus'
    const amountToSend = '100000000000000000' // 0.1 INJ

    console.log(`Sending ${amountToSend} wei to ${recipientAddress}...`)
    const txHash = await client.sendTokens(recipientAddress, amountToSend)
    console.log('Transaction sent successfully! Transaction Hash:', txHash)

    // fetch recipient balance
    const recipientBalance = await client.getAddressBalance(recipientAddress)
    console.log(`Recipient Balance ${recipientAddress}:`, recipientBalance + ' wei')
    // fetch sender balance after sending tokens
    const postWalletBalance = await client.getWalletBalance()
    console.log('Sender Balance:', postWalletBalance + ' wei')

    console.log('All operations completed successfully!')
}

main()
