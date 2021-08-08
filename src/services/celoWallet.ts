import { toTxResult } from '@celo/connect';
import { ContractKit } from '@celo/contractkit';
import {
    requestTxSig,
    FeeCurrency,
    waitForSignedTxs,
    TxParams,
} from '@celo/dappkit';
import { celoNetwork } from 'helpers/constants';
import { makeDeeplinkUrl } from 'helpers/index';
import * as Sentry from 'sentry-expo';
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

    /**
     * This approach ensures that no transaction will remain waiting more than 10s
     * while communicating with Valora. If this timeout happen, we throw an error
     * and logged a sentry timeout message.
     * **/

    await Promise.race([
        (async () => {
            await requestTxSig(kit, [requestTx], {
                requestId,
                dappName,
                callback,
            });
            const dappkitResponse = await waitForSignedTxs(requestId);
            const tx = dappkitResponse.rawTxs[0];
            return toTxResult(
                kit.web3.eth.sendSignedTransaction(tx)
            ).waitReceipt();
        })(),
        (async () => {
            await new Promise((res) => setTimeout(res, 10000));
            Sentry.Native.captureMessage(
                JSON.stringify({ action: 'celoWallet communication timeout' }),
                Sentry.Native.Severity.Critical
            );
            throw new Error('Timeout while communicating with celoWallet');
        })(),
    ]);
    return;
}

export { celoWalletRequest };
