import React from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import { celoWalletRequest } from 'services/celoWallet';

import config from '../../../config';
import { celoNetwork } from 'helpers/constants';
import { IRootState, IPrivateCommunity } from 'helpers/types/state';
import CommunityContractABI from '../../contracts/CommunityABI.json';
import CommunityBytecode from '../../contracts/CommunityBytecode.json';

import { formatInputAmountToTransfer } from 'helpers/currency';

export const deployPrivateCommunity = async (
    privateCommunity: IPrivateCommunity
) => {
    const {
        userAddress,
        claimAmount,
        maxClaim,
        baseInterval,
        incrementInterval,
    } = privateCommunity;

    const kit = useSelector((state: IRootState) => state.app.kit);

    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    const CommunityContract = new kit.web3.eth.Contract(
        CommunityContractABI as any
    );
    const txObject = await CommunityContract.deploy({
        data: CommunityBytecode.bytecode,
        arguments: [
            userAddress,
            new BigNumber(formatInputAmountToTransfer(claimAmount))
                .multipliedBy(decimals)
                .toString(),
            new BigNumber(formatInputAmountToTransfer(maxClaim))
                .multipliedBy(decimals)
                .toString(),
            baseInterval,
            (parseInt(incrementInterval, 10) * 60).toString(),
            celoNetwork.noAddress,
            config.cUSDContract,
            userAddress,
        ],
    });
    // exception is handled outside
    // receipt as undefined is handled outside
    const receipt = await celoWalletRequest(
        userAddress,
        celoNetwork.noAddress,
        txObject,
        'createcommunity',
        kit
    );
    return receipt;
};
