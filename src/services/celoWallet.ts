import { toTxResult } from '@celo/contractkit/lib/utils/tx-result';
import { requestTxSig, FeeCurrency, waitForSignedTxs } from '@celo/dappkit';
import { ContractKit } from '@celo/contractkit';
import * as Sentry from 'sentry-expo';
import { makeDeeplinkUrl } from 'helpers/index';
import { TransactionReceipt } from 'web3-core'; // imported from waitReceipt method

async function celoWalletRequest(
    from: string,
    to: string,
    txObject: any,
    requestId: string,
    kit: ContractKit,
    useTo?: boolean
): Promise<TransactionReceipt | undefined> {
    const dappName = 'impactmarket';
    const callback = makeDeeplinkUrl();
    try {
        const reqTxTo = {
            from,
            to,
            tx: txObject,
            feeCurrency: FeeCurrency.cUSD,
        };
        const reqTx = {
            from,
            tx: txObject,
            feeCurrency: FeeCurrency.cUSD,
        };
        await requestTxSig(kit, [useTo === false ? reqTx : reqTxTo], {
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
            if (e.message.includes('known transaction')) {
                return;
            }
            Sentry.captureException(e);
        }
        throw new Error(e);
    }
}

export { celoWalletRequest };
