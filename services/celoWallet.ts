import { requestTxSig, FeeCurrency, waitForSignedTxs } from "@celo/dappkit";
import { INetworkState } from "../helpers/types";
import { Linking } from "expo";
import { toTxResult } from "@celo/contractkit/lib/utils/tx-result";


async function celoWalletRequest(
    from: string,
    to: string,
    txObject: any,
    requestId: string,
    network: INetworkState,
): Promise<any> {
    const dappName = 'Impact Market'
    const callback = Linking.makeUrl('impactmarketmobile://' + requestId)

    requestTxSig(
        network.kit,
        [
            {
                from,
                to,
                tx: txObject,
                feeCurrency: FeeCurrency.cUSD
            }
        ],
        { requestId, dappName, callback }
    )

    const dappkitResponse = await waitForSignedTxs(requestId);
    const tx = dappkitResponse.rawTxs[0];
    return toTxResult(network.kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();
}

export {
    celoWalletRequest,
}