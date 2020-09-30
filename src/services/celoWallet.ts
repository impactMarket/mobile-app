import { toTxResult } from '@celo/contractkit/lib/utils/tx-result';
import { requestTxSig, FeeCurrency, waitForSignedTxs } from '@celo/dappkit';
import * as Linking from 'expo-linking';
import { ContractKit } from '@celo/contractkit';
import * as Sentry from 'sentry-expo';

async function celoWalletRequest(
    from: string,
    to: string,
    txObject: any,
    requestId: string,
    kit: ContractKit
): Promise<any> {
    const dappName = 'impactmarket';
    const callback = Linking.makeUrl(requestId);
    try {
        await requestTxSig(
            kit,
            [
                {
                    from,
                    to,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD,
                },
            ],
            { requestId, dappName, callback }
        );
        const dappkitResponse = await waitForSignedTxs(requestId);
        const tx = dappkitResponse.rawTxs[0];
        return toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();
    } catch (e) {
        Sentry.captureMessage(
            JSON.stringify(txObject._method),
            Sentry.Severity.Critical
        );
        Sentry.captureException(e);
        throw new Error(e);
    }
}

export { celoWalletRequest };
