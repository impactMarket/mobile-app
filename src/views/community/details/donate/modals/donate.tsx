import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Button from 'components/core/Button';
import Modal from 'components/Modal';
import {
    formatInputAmountToTransfer,
    getCurrencySymbol,
} from 'helpers/currency';
import { ICommunity } from 'helpers/types/endpoints';
import { IUserState } from 'helpers/types/state';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TextInput } from 'react-native';
import { Paragraph, Snackbar } from 'react-native-paper';
import { iptcColors } from 'styles/index';
import Clipboard from 'expo-clipboard';
import config from '../../../../../../config';

interface IDonateModalProps {
    visible: boolean;
    onDismiss: () => void;
    user: IUserState;
    rates: any;
    community: ICommunity;
    handleConfirmDonateWithCeloWallet: (amount: string) => void;
}
interface IDonateModalState {
    donating: boolean;
    amountDonate: string;
    showCopiedToClipboard: boolean;
}
export default class DonateModal extends Component<
    IDonateModalProps,
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

    handleCopyAddressToClipboard = () => {
        Clipboard.setString(this.props.community.contractAddress!);
        this.setState({ showCopiedToClipboard: true });
        setTimeout(() => this.setState({ showCopiedToClipboard: false }), 5000);
        this.props.onDismiss();
    };

    render() {
        const {
            visible,
            onDismiss,
            user,
            rates,
            community,
            handleConfirmDonateWithCeloWallet,
        } = this.props;
        const { amountDonate, donating, showCopiedToClipboard } = this.state;

        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            this.props.user.exchangeRate;

        const backForDays =
            amountInDollars /
            new BigNumber(community.contract.claimAmount)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber() /
            community.state.beneficiaries;

        const donateWithValoraButton =
            user.wallet.address.length > 0 ? (
                <Button
                    modeType="default"
                    bold={true}
                    labelStyle={styles.donateLabel}
                    loading={donating}
                    disabled={
                        donating ||
                        amountDonate.length === 0 ||
                        isNaN(parseInt(amountDonate, 10)) ||
                        parseInt(amountDonate, 10) < 0
                    }
                    onPress={() =>
                        handleConfirmDonateWithCeloWallet(amountDonate)
                    }
                >
                    {i18n.t('donateWithValora')}
                </Button>
            ) : (
                <Button
                    icon="alert"
                    modeType="default"
                    bold={true}
                    style={{
                        backgroundColor: '#f0ad4e',
                    }}
                    labelStyle={styles.donateLabel}
                    onPress={() => {
                        Alert.alert(
                            i18n.t('failure'),
                            i18n.t('youAreNotConnected'),
                            [{ text: i18n.t('close') }],
                            { cancelable: false }
                        );
                    }}
                >
                    {i18n.t('donateWithValora')}
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
                        label: i18n.t('close'),
                        onPress: () =>
                            this.setState({ showCopiedToClipboard: false }),
                    }}
                >
                    {i18n.t('addressCopiedClipboard')}
                </Snackbar>
                <Modal
                    title={i18n.t('donateSymbol', {
                        symbol: user.metadata.currency,
                    })}
                    visible={visible}
                    buttons={
                        <>
                            <Button
                                modeType="gray"
                                bold={true}
                                style={{ marginBottom: 10 }}
                                labelStyle={styles.donateLabel}
                                onPress={this.handleCopyAddressToClipboard}
                            >
                                {i18n.t('copyContractAddress')}
                            </Button>
                            {donateWithValoraButton}
                        </>
                    }
                    onDismiss={() => {
                        onDismiss();
                        this.setState({ amountDonate: '' });
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#F6F6F7',
                            // opacity: 0.27,
                            alignItems: 'center',
                            borderRadius: 5,
                            padding: 13,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 50,
                                    lineHeight: 60,
                                    height: 60,
                                    textAlign: 'center',
                                    color: iptcColors.almostBlack,
                                    textAlignVertical: 'center',
                                }}
                            >
                                {getCurrencySymbol(
                                    this.props.user.metadata.currency
                                )}
                            </Text>
                            <TextInput
                                keyboardType="numeric"
                                maxLength={9}
                                autoFocus={true}
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 50,
                                    lineHeight: 60,
                                    height: 60,
                                    textAlign: 'center',
                                    color: iptcColors.almostBlack,
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
                                            rates[community.currency].rate *
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
                    <View style={{ height: 23 * 2 + 19 * 2 }}>
                        <Paragraph
                            style={{
                                marginVertical: 23,
                                fontSize: 16,
                                lineHeight: 19,
                                height: 19 * 2 /** TODO: fix height */,
                                textAlign: 'center',
                                fontStyle: 'italic',
                                color: iptcColors.textGray,
                                display:
                                    amountDonate.length === 0 ||
                                    isNaN(parseInt(amountDonate, 10)) ||
                                    parseInt(amountDonate, 10) < 0 ||
                                    new BigNumber(
                                        community.contract.claimAmount
                                    )
                                        .dividedBy(10 ** config.cUSDDecimals)
                                        .gt(amountInDollars)
                                        ? 'flex'
                                        : 'none',
                            }}
                        >
                            {i18n.t('amountShouldBe', {
                                claimAmount: parseFloat(
                                    new BigNumber(
                                        community.contract.claimAmount
                                    )
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
                                    new BigNumber(
                                        community.contract.claimAmount
                                    )
                                        .dividedBy(10 ** config.cUSDDecimals)
                                        .lte(amountInDollars)
                                        ? 'flex'
                                        : 'none',
                            }}
                        >
                            {i18n.t('yourDonationWillBackFor', {
                                backNBeneficiaries: Math.min(
                                    community.state.beneficiaries,
                                    amountDonate.length > 0
                                        ? Math.floor(
                                              amountInDollars /
                                                  new BigNumber(
                                                      community.contract.claimAmount
                                                  )
                                                      .dividedBy(
                                                          10 **
                                                              config.cUSDDecimals
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
                </Modal>
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
