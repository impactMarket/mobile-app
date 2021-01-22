import { toTxResult } from '@celo/contractkit/lib/utils/tx-result';
import { requestTxSig, FeeCurrency, waitForSignedTxs, TxParams } from '@celo/dappkit';
import { ContractKit } from '@celo/contractkit';
import * as Sentry from 'sentry-expo';
import { makeDeeplinkUrl } from 'helpers/index';
import { TransactionReceipt } from 'web3-core'; // imported from waitReceipt method
import { celoNetwork } from 'helpers/constants';

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
                to
            };
        }
        await requestTxSig(kit, [requestTx], {
            requestId,
            dappName,
            callback,
        });
        const dappkitResponse = await waitForSignedTxs(requestId);
        const tx = dappkitResponse.rawTxs[0];
        return toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();
    } catch (e) {
        if (!__DEV__) {
            // as transaction requests get pending, they then resume all at once
            if (!e.toLowerCase().includes('known transaction')) {
                Sentry.captureException(e);
            }
        }
        throw new Error(e);
    }
}

export { celoWalletRequest };
