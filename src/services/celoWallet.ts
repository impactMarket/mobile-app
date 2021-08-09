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
    const dappkitResponse = await waitForSignedTxs(requestId);
    const tx = dappkitResponse.rawTxs[0];
    return toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();
}

export { celoWalletRequest };
