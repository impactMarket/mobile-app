import { ContractKit } from '@celo/contractkit';
// import { toTxResult } from '@celo/contractkit/lib/utils/tx-result';
import {
    requestTxSig,
    FeeCurrency,
    waitForSignedTxs,
    TxParams,
} from '@celo/dappkit';
import { celoNetwork } from 'helpers/constants';
import { makeDeeplinkUrl } from 'helpers/index';
import * as Sentry from 'sentry-expo';
import { TransactionReceipt, PromiEvent } from 'web3-core';

function waitForReceipt(
    tx: PromiEvent<TransactionReceipt>
): Promise<TransactionReceipt> {
    return new Promise((resolve, reject) => {
        tx.once('receipt', (receipt) => {
            resolve(receipt);
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function celoWalletRequest(
    from: string,
    to: string,
    txObject: any,
    requestId: string,
    kit: ContractKit
): Promise<TransactionReceipt | undefined> {
    const dappName = 'impactmarket';
    const callback = makeDeeplinkUrl();
    try {
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
        const dappkitResponse = await waitForSignedTxs(requestId);
        const tx = dappkitResponse.rawTxs[0];
        return waitForReceipt(kit.web3.eth.sendSignedTransaction(tx));
    } catch (e) {
        if (!__DEV__) {
            // as transaction requests get pending, they then resume all at once
            if (e.toLowerCase().includes('known transaction')) {
                return;
            }
            Sentry.captureException(e);
        }
        throw new Error(e);
    }
}

export { celoWalletRequest };
