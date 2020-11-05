import { toTxResult } from '@celo/contractkit/lib/utils/tx-result';
import { requestTxSig, FeeCurrency, waitForSignedTxs } from '@celo/dappkit';
import { ContractKit } from '@celo/contractkit';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import Api from './api';
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
    let currentProvider = '';
    if (kit.web3.currentProvider !== null) {
        if (typeof kit.web3.currentProvider === 'string') {
            currentProvider = kit.web3.currentProvider;
        } else if (
            (kit.web3.currentProvider as any).existingProvider !== undefined &&
            (kit.web3.currentProvider as any).existingProvider !== null
        ) {
            currentProvider = (kit.web3.currentProvider as any).existingProvider
                .host;
        }
    }
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
        if (
            Constants.manifest.packagerOpts === undefined ||
            !Constants.manifest.packagerOpts?.dev
        ) {
            // as transaction requests get pending, they then resume all at once
            if (e.message.includes('known transaction')) {
                return;
            }
            Sentry.captureMessage(
                JSON.stringify({
                    from,
                    to,
                    method: txObject._method.name,
                    provider: currentProvider,
                }),
                Sentry.Severity.Critical
            );
            Sentry.captureException(e);
        }
        Api.uploadError(from, 'wallet_request', e);
        throw new Error(e);
    }
}

export { celoWalletRequest };
