import { toTxResult, CeloTxReceipt } from '@celo/connect';
import { ContractKit } from '@celo/contractkit';
import {
    requestTxSig,
    FeeCurrency,
    waitForSignedTxs,
    TxParams,
} from '@celo/dappkit';
import { celoNetwork } from 'helpers/constants';
import { makeDeeplinkUrl } from 'helpers/index';
import { TransactionReceipt } from 'web3-core';

async function celoWalletRequest(
    from: string,
    to: string,
    txObject: any,
    requestId: string,
    kit: ContractKit
): Promise<TransactionReceipt | undefined> {
    const dappName = 'impactMarket';
    const callback = makeDeeplinkUrl();
    // no need to try-catch; it's always done outside
    // to handle issues in the UI
    let requestTx: TxParams = {
        from,
        tx: txObject,
        feeCurrency: FeeCurrency.cUSD,
    };
    if (to !== celoNetwork.noAddress) {
        requestTx = {
            ...requestTx,
            to,
        };
    }
    await requestTxSig(kit, [requestTx], {
        requestId,
        dappName,
        callback,
    });

    // code below is only dedicated to re-submit transctions in case of network failure
    let receipt: CeloTxReceipt;
    const dappkitResponse = await waitForSignedTxs(requestId);
    const tx = dappkitResponse.rawTxs[0];
    let tries = 3;

    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    while (tries-- > 0) {
        try {
            // if you are wondering if this submits two transactions, no it doesn't.
            // it uses the rawTx from the wallet. Can only successfully submit once.
            // also, *sendSignedTransaction* needs to be called again, otherwise nothing happens.
            receipt = await toTxResult(
                kit.web3.eth.sendSignedTransaction(tx)
            ).waitReceipt();
            tries = 0;
        } catch (e) {
            // it sometimes happen that the transaction is not sent, apparently due to connection issues
            // in that case, let's just send it again
            if (
                e.message.indexOf('network connection') === -1 &&
                e.message.indexOf('JSON RPC') === -1
            ) {
                throw e;
            } else if (e.message.indexOf('nonce') !== -1) {
                // the approach of re-submitting a transaction, generates a "nonce too low" error
                // although, successfully submitted. Let's ignore it and jump out.
                tries = 0;
            }
            await delay(3000);
        }
    }
    return receipt;
}

export { celoWalletRequest };
