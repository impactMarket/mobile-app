import { toTxResult } from '@celo/contractkit/lib/utils/tx-result';
import { requestTxSig, FeeCurrency, waitForSignedTxs } from '@celo/dappkit';
import * as Linking from 'expo-linking';
import { ContractKit } from '@celo/contractkit';

async function celoWalletRequest(
    from: string,
    to: string,
    txObject: any,
    requestId: string,
    kit: ContractKit
): Promise<any> {
    const dappName = 'impactMarket';
    const callback = Linking.makeUrl(`${requestId}/`);

    requestTxSig(
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
    return toTxResult(
        kit.web3.eth.sendSignedTransaction(tx)
    ).waitReceipt();
}

export { celoWalletRequest };
