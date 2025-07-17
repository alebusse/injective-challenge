import assert from 'assert/strict'
import { mock, when, instance, anything, capture } from 'ts-mockito'
import { ChainRestBankApi, MsgBroadcasterWithPk, MsgSend, TxResponse } from '@injectivelabs/sdk-ts'
import { InjectiveClient } from '../src/client'
import { InjectiveWallet } from '../src/wallet'

describe('InjectiveClient', () => {
    const fakeWallet: InjectiveWallet = InjectiveWallet.generate()

    describe('getAddressBalance', () => {
        it('returns wallet balance from mocked bankApi', async () => {
            const expecteBalance = '1234'

            const mockBankApi = mock<ChainRestBankApi>()
            when(mockBankApi.fetchBalance(fakeWallet.address, 'inj')).thenResolve({ amount: expecteBalance, denom: 'inj' })

            const client = new InjectiveClient({
                wallet: fakeWallet,
                bankApi: instance(mockBankApi),
            })

            const balance = await client.getWalletBalance()

            assert.equal(balance, expecteBalance)
        })

        it('throws error for invalid address', async () => {
            const client = new InjectiveClient({
                wallet: fakeWallet,
            })

            await assert.rejects(
                client.getAddressBalance('invalid_address'),
                /Invalid Injective address, got: invalid_address/
            )
        })
    })

    describe('sendTokens', () => {
        it('sends tokens and returns txHash using mocked broadcaster', async () => {
            const receiverAddress = 'inj1yk5jlvvnx0jxpza5vke8c882x4ku830sce8tus'
            const amountToSend = '1000'
            const denomination = 'inj'

            const mockBroadcaster = mock<MsgBroadcasterWithPk>()
            when(mockBroadcaster.broadcast(anything())).thenResolve({ txHash: 'FAKE_TX_HASH_ABC123' } as TxResponse)

            const client = new InjectiveClient({
                wallet: fakeWallet,
                broadcaster: instance(mockBroadcaster),
            })

            const txHash = await client.sendTokens(receiverAddress, amountToSend)

            assert.equal(txHash, 'FAKE_TX_HASH_ABC123')

            // Verify that the broadcaster was called with the correct message
            const [input] = capture(mockBroadcaster.broadcast).last();
            const firstMsg = Array.isArray(input.msgs) ? input.msgs[0] : input.msgs;
            assert.ok(firstMsg instanceof MsgSend, 'Expected MsgSend message to be sent');
            const sendMsgData = JSON.parse(firstMsg.toJSON());
            assert.equal(sendMsgData.fromAddress, fakeWallet.address);
            assert.equal(sendMsgData.toAddress, receiverAddress);
            assert.deepEqual(sendMsgData.amount, [{ denom: denomination, amount: amountToSend }]);
        })

        it('throws error for invalid recipient address', async () => {
            const client = new InjectiveClient({
                wallet: fakeWallet,
            })

            await assert.rejects(
                client.sendTokens('invalid_address', '1000'),
                /Invalid Injective address, got: invalid_address/
            )
        })

        it('throws error for invalid amount', async () => {
            const client = new InjectiveClient({
                wallet: fakeWallet,
            })

            await assert.rejects(
                client.sendTokens('inj1yk5jlvvnx0jxpza5vke8c882x4ku830sce8tus', 'invalid_amount'),
                /Invalid amount, got: invalid_amount/
            )
        })
    })
})