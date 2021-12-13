import { Body, Button, colors } from '@impact-market/ui-kit';
import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Divider from 'components/Divider';
// import Modal from 'components/Modal';
// import Button from 'components/core/Button';
import * as Clipboard from 'expo-clipboard';
import { modalDonateAction } from 'helpers/constants';
import {
    formatInputAmountToTransfer,
    getCurrencySymbol,
} from 'helpers/currency';
import { ModalActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TextInput } from 'react-native';
import { Paragraph, Snackbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

import config from '../../../../../../config';
import CommunityContractABI from '../../../../../contracts/CommunityABI.json';
import DonationMinerABI from '../../../../../contracts/DonationMinerABI.json';

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });

interface IDonateModalProps {}
interface IDonateModalState {
    donating: boolean;
    approving: boolean;
    amountDonate: string;
    showCopiedToClipboard: boolean;
    approved: boolean;
    isNew: boolean;
}
class DonateModal extends Component<
    IDonateModalProps & PropsFromRedux,
    IDonateModalState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            donating: false,
            approving: false,
            amountDonate: '',
            showCopiedToClipboard: false,
            approved: false,
            isNew: true,
        };
    }

    componentDidUpdate = (prevProps: IDonateModalProps & PropsFromRedux) => {
        if (prevProps.inputAmount !== this.props.inputAmount) {
            // TODO:
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ amountDonate: this.props.inputAmount });
        }
    };

    handleCopyAddressToClipboard = () => {
        if (this.props.community) {
            const { contractAddress } = this.props.community;
            Clipboard.setString(contractAddress!);
            this.setState({ showCopiedToClipboard: true });
            this.props.dismissModal();
        }
    };

    handleConfirmDonateWithCeloWallet = () => {
        const { exchangeRate, userBalance, community } = this.props;
        if (
            community === undefined ||
            community.contract === undefined ||
            community.state === undefined
        ) {
            return;
        }
        const { amountDonate } = this.state;
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            exchangeRate;
        if (
            amountInDollars >
            new BigNumber(userBalance)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber()
        ) {
            this.props.goToErrorModal();
        } else {
            let backForDays =
                amountInDollars /
                new BigNumber(community.contract.claimAmount)
                    .dividedBy(10 ** config.cUSDDecimals)
                    .toNumber() /
                community.state.beneficiaries;
            backForDays =
                amountDonate.length > 0
                    ? Math.max(1, Math.floor(backForDays))
                    : 0;
            const backNBeneficiaries = Math.min(
                community.state.beneficiaries,
                amountDonate.length > 0
                    ? Math.floor(
                          amountInDollars /
                              new BigNumber(community.contract.claimAmount)
                                  .dividedBy(10 ** config.cUSDDecimals)
                                  .toNumber()
                      )
                    : 0
            );
            this.props.goToConfirmModal({
                inputAmount: amountDonate,
                amountInDollars,
                backForDays,
                backNBeneficiaries,
            });
        }
    };

    approve = async () => {
        const { kit, userAddress, community, exchangeRate } = this.props;
        if (community === undefined) {
            return;
        }
        const { amountDonate } = this.state;
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            exchangeRate;
        // no need to check if enough for tx fee
        this.setState({ donating: true });

        let contractAddressTo = '';
        let txObject;
        const cUSDAmount = new BigNumber(amountInDollars)
            .multipliedBy(new BigNumber(10).pow(18))
            .toString();
        // const communityContract = new kit.web3.eth.Contract(
        //     CommunityContractABI as any,
        //     community.contractAddress!
        // );
        // // const isNewCommunity = await communityContract.methods
        // //     .impactMarketAddress()
        // //     .call();
        // // if (isNewCommunity === '0x0000000000000000000000000000000000000000') {
        const stableToken = await this.props.kit.contracts.getStableToken();
        const donationMiner = new this.props.kit.web3.eth.Contract(
            DonationMinerABI as any,
            config.donationMinerAddress
        );
        txObject = stableToken.approve(
            community.contractAddress!,
            cUSDAmount
        ).txo;
        contractAddressTo = stableToken.address;
        // to approve
        await celoWalletRequest(
            userAddress,
            contractAddressTo,
            txObject,
            'approve',
            kit
        );
        // to donate
        txObject = await donationMiner.methods.donateToCommunity(
            community.contractAddress!,
            cUSDAmount
        );
        contractAddressTo = config.donationMinerAddress;
    };

    render() {
        const {
            visible,
            dismissModal,
            community,
            //
            userCurrency,
            exchangeRate,
            exchangeRates,
            userAddress,
        } = this.props;
        const { amountDonate, donating, approved } = this.state;

        if (
            community === undefined ||
            community.contract === undefined ||
            community.state === undefined
        ) {
            return null;
        }

        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            exchangeRate;

        const backForDays =
            amountInDollars /
            new BigNumber(community.contract.claimAmount)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber() /
            community.state.beneficiaries;

        return (
            <>
                <View
                    style={{
                        backgroundColor: 'white',
                        // opacity: 0.27,
                        alignItems: 'center',
                        borderRadius: 5,
                        padding: 13,
                    }}
                    testID="modalDonateWithCelo"
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 50,
                                lineHeight: 60,
                                height: 60,
                                textAlign: 'center',
                                color: ipctColors.almostBlack,
                                textAlignVertical: 'center',
                            }}
                        >
                            {getCurrencySymbol(userCurrency)}
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            maxLength={9}
                            autoFocus
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 50,
                                lineHeight: 60,
                                height: 60,
                                textAlign: 'center',
                                color: ipctColors.almostBlack,
                            }}
                            value={amountDonate}
                            onChangeText={(text) =>
                                this.setState({
                                    amountDonate: text,
                                })
                            }
                        />
                    </View>
                    <View style={{ height: 19 }}>
                        <Paragraph
                            style={{
                                fontSize: 16,
                                lineHeight: 19,
                                height: 19,
                                color: 'rgba(0, 0, 0, 0.6)',
                                display:
                                    amountDonate.length > 0 &&
                                    !isNaN(parseInt(amountDonate, 10)) &&
                                    parseInt(amountDonate, 10) > 0
                                        ? 'flex'
                                        : 'none',
                            }}
                        >
                            ~
                            {`${getCurrencySymbol(community.currency)}${(
                                Math.floor(
                                    amountInDollars *
                                        exchangeRates[community.currency] *
                                        100
                                ) / 100
                            )
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
                                community.currency
                            }`}
                        </Paragraph>
                    </View>
                </View>
                {/** TODO: fix height */}
                <View style={{ height: 23 * 2 }}>
                    <Body
                        style={{
                            marginVertical: 23,
                            fontSize: 16,
                            lineHeight: 19,
                            height: 19 * 2 /** TODO: fix height */,
                            textAlign: 'center',
                            fontStyle: 'italic',
                            color: ipctColors.regentGray,
                            display:
                                amountDonate.length === 0 ||
                                isNaN(parseInt(amountDonate, 10)) ||
                                parseInt(amountDonate, 10) < 0 ||
                                new BigNumber(community.contract.claimAmount)
                                    .dividedBy(10 ** config.cUSDDecimals)
                                    .gt(amountInDollars)
                                    ? 'flex'
                                    : 'none',
                        }}
                    >
                        {i18n.t('donate.amountShouldBe', {
                            claimAmount: parseFloat(
                                new BigNumber(community.contract.claimAmount)
                                    .dividedBy(10 ** config.cUSDDecimals)
                                    .decimalPlaces(2, 1)
                                    .toString()
                            ),
                        })}
                    </Body>
                    <Body
                        style={{
                            marginVertical: 23,
                            fontSize: 16,
                            lineHeight: 19,
                            height: 19,
                            textAlign: 'center',
                            display:
                                amountDonate.length > 0 &&
                                new BigNumber(community.contract.claimAmount)
                                    .dividedBy(10 ** config.cUSDDecimals)
                                    .lte(amountInDollars)
                                    ? 'flex'
                                    : 'none',
                        }}
                    >
                        {i18n.t('donate.yourDonationWillBackFor', {
                            backNBeneficiaries: Math.min(
                                community.state.beneficiaries,
                                amountDonate.length > 0
                                    ? Math.floor(
                                          amountInDollars /
                                              new BigNumber(
                                                  community.contract.claimAmount
                                              )
                                                  .dividedBy(
                                                      10 ** config.cUSDDecimals
                                                  )
                                                  .toNumber()
                                      )
                                    : 0
                            ),
                            backForDays:
                                amountDonate.length > 0
                                    ? Math.max(1, Math.floor(backForDays))
                                    : 0,
                        })}
                    </Body>
                </View>
                <View style={{ margin: 22 }}>
                    <View
                        style={{
                            marginVertical: 6,
                            marginHorizontal: 61.25,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                height: 32,
                                width: 32,
                                borderRadius: 16,
                                alignSelf: 'center',
                                backgroundColor: approved
                                    ? colors.ui.success
                                    : colors.brand.primary,
                            }}
                        >
                            <Body
                                style={{
                                    color: 'white',
                                    alignSelf: 'center',
                                    lineHeight: 32,
                                    fontSize: 14,
                                }}
                            >
                                1
                            </Body>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Divider />
                        </View>
                        <View
                            style={{
                                height: 32,
                                width: 32,
                                borderRadius: 16,
                                alignSelf: 'center',
                                backgroundColor: approved
                                    ? colors.brand.primary
                                    : colors.background.inputs,
                            }}
                        >
                            <Body
                                style={{
                                    color: approved
                                        ? 'white'
                                        : colors.text.secondary,
                                    alignSelf: 'center',
                                    lineHeight: 32,
                                    fontSize: 14,
                                }}
                            >
                                2
                            </Body>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button
                            mode={approved ? 'green' : 'default'}
                            style={{ flex: 1, marginRight: 4 }}
                            disabled={
                                donating ||
                                amountDonate.length === 0 ||
                                isNaN(parseInt(amountDonate, 10)) ||
                                parseInt(amountDonate, 10) < 0 ||
                                approved
                            }
                            onPress={this.approve}
                        >
                            Approve
                        </Button>
                        <Button
                            mode={approved ? 'default' : 'gray'}
                            textStyle={styles.donateLabel}
                            style={{
                                flex: 1,
                                marginLeft: 4,
                            }}
                            // loading={donating}
                            disabled={
                                donating ||
                                amountDonate.length === 0 ||
                                isNaN(parseInt(amountDonate, 10)) ||
                                parseInt(amountDonate, 10) < 0 ||
                                !approved
                            }
                            onPress={this.handleConfirmDonateWithCeloWallet}
                        >
                            {i18n.t('donate.donate')}
                        </Button>
                    </View>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    donate: {
        borderRadius: 0,
        height: 69,
    },
    donateLabel: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.3,
    },
});

const mapStateToProps = (state: IRootState) => {
    const { exchangeRates, kit } = state.app;
    const { currency, address } = state.user.metadata;
    const { exchangeRate } = state.user;
    const { modalDonateOpen, community, donationValues } = state.modalDonate;
    return {
        exchangeRates,
        userCurrency: currency,
        userAddress: address,
        userBalance: state.user.wallet.balance,
        exchangeRate,
        visible: modalDonateOpen,
        community,
        inputAmount: donationValues.inputAmount,
        kit,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<ModalActionTypes>) => {
    return {
        goToConfirmModal: (values: {
            inputAmount: string;
            amountInDollars: number;
            backNBeneficiaries: number;
            backForDays: number;
        }) =>
            dispatch({
                type: modalDonateAction.GO_TO_CONFIRM_DONATE,
                payload: values,
            }),
        goToErrorModal: () =>
            dispatch({ type: modalDonateAction.GO_TO_ERROR_DONATE }),
        dismissModal: () => dispatch({ type: modalDonateAction.CLOSE }),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DonateModal);
