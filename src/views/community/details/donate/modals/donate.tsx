import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Button from 'components/core/Button';
import * as Clipboard from 'expo-clipboard';
import { modalDonateAction } from 'helpers/constants';
import { formatInputAmountToTransfer } from 'helpers/currency';
import { ModalActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Paragraph, Snackbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { ipctColors } from 'styles/index';

import config from '../../../../../../config';

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });

interface IDonateModalProps {}
interface IDonateModalState {
    donating: boolean;
    amountDonate: string;
    showCopiedToClipboard: boolean;
}
class DonateModal extends Component<
    IDonateModalProps & PropsFromRedux,
    IDonateModalState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            donating: false,
            amountDonate: '',
            showCopiedToClipboard: false,
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

    render() {
        const { community, exchangeRate } = this.props;
        const { amountDonate, donating, showCopiedToClipboard } = this.state;

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

        const donateWithValoraButton = (
            <Button
                style={{ width: '90%', alignSelf: 'center' }}
                modeType="default"
                bold
                labelStyle={styles.donateLabel}
                loading={donating}
                disabled={
                    donating ||
                    amountDonate.length === 0 ||
                    isNaN(parseInt(amountDonate, 10)) ||
                    parseInt(amountDonate, 10) < 0
                }
                onPress={this.handleConfirmDonateWithCeloWallet}
            >
                {i18n.t('donate.donateWithValora')}
            </Button>
        );

        const copycontractButton = (
            <Button
                style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: 10,
                    backgroundColor: '#E9EDF4',
                }}
                modeType="gray"
                labelStyle={styles.donateLabel}
                loading={donating}
                disabled={
                    donating ||
                    amountDonate.length === 0 ||
                    isNaN(parseInt(amountDonate, 10)) ||
                    parseInt(amountDonate, 10) < 0
                }
                onPress={this.handleConfirmDonateWithCeloWallet}
            >
                {i18n.t('community.copyContractAddress')}
            </Button>
        );

        return (
            <>
                <Snackbar
                    visible={showCopiedToClipboard}
                    onDismiss={() =>
                        this.setState({ showCopiedToClipboard: false })
                    }
                    action={{
                        label: i18n.t('generic.close'),
                        onPress: () =>
                            this.setState({ showCopiedToClipboard: false }),
                    }}
                >
                    {i18n.t('donate.addressCopiedClipboard')}
                </Snackbar>
                <View
                    style={{
                        alignItems: 'center',
                        borderRadius: 5,
                        padding: 13,
                    }}
                    testID="modalDonateWithCelo"
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                        }}
                    >
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
                        <Text
                            style={{
                                fontFamily: 'Inter-Bold',
                                fontSize: 14,
                                lineHeight: 26,
                                textAlign: 'center',
                                color: ipctColors.almostBlack,
                                marginBottom: 8,
                            }}
                        >
                            {community.currency}
                        </Text>
                    </View>
                </View>
                {/** TODO: fix height */}
                <View style={{ height: 23 * 2 + 19 * 2 }}>
                    <Paragraph
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
                    </Paragraph>
                    <Paragraph
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
                    </Paragraph>
                </View>
                {donateWithValoraButton}
                {copycontractButton}
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
        fontSize: 15,
        lineHeight: 28,
        letterSpacing: 0.3,
        fontFamily: 'Inter-Regular',
    },
});

const mapStateToProps = (state: IRootState) => {
    const { exchangeRates } = state.app;
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
