import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Button from 'components/core/Button';
import * as Device from 'expo-device';
import { modalDonateAction, Screens } from 'helpers/constants';
import { getCurrencySymbol } from 'helpers/currency';
import { chooseMediaThumbnail, getUserBalance } from 'helpers/index';
import { setUserWalletBalance } from 'helpers/redux/actions/user';
import { navigationRef } from 'helpers/rootNavigation';
import { ModalActionTypes, UserActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { Component, Dispatch } from 'react';
import { Trans } from 'react-i18next';
import { Text, View, StyleSheet, Alert, Image } from 'react-native';
import { batch, connect, ConnectedProps } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { analytics } from 'services/analytics';
import { celoWalletRequest } from 'services/celoWallet';

interface IConfirmModalProps {}
interface IConfirmModalState {
    donating: boolean;
}
class ConfirmModal extends Component<
    IConfirmModalProps & PropsFromRedux,
    IConfirmModalState
> {
    constructor(props: any) {
        super(props);
        this.state = {
            donating: false,
        };
    }

    donateWithCeloWallet = async () => {
        const {
            kit,
            userAddress,
            amountInDollars,
            community,
            updateUserBalance,
        } = this.props;
        if (community === undefined) {
            return;
        }
        // no need to check if enough for tx fee
        this.setState({ donating: true });
        const stableToken = await this.props.kit.contracts.getStableToken();
        const cUSDDecimals = await stableToken.decimals();
        const txObject = stableToken.transfer(
            community.contractAddress!,
            new BigNumber(amountInDollars)
                .multipliedBy(new BigNumber(10).pow(cUSDDecimals))
                .toString()
        ).txo;
        batch(() => {
            this.props.setInProgress(true);
            this.props.dismissModal();
        });
        navigationRef.current?.navigate(Screens.WaitingTx);
        const executeTx = () =>
            celoWalletRequest(
                userAddress,
                stableToken.address,
                txObject,
                'donatetocommunity',
                kit
            )
                .then((tx) => {
                    if (tx === undefined || (tx as any) === {}) {
                        throw new Error('invalid tx response');
                    }
                    // TODO: wait for tx confirmation and request UI update
                    // update donated values
                    setTimeout(async () => {
                        const newBalanceStr = (
                            await getUserBalance(kit, userAddress)
                        ).toString();
                        updateUserBalance(newBalanceStr);
                    }, 1200);
                    this.props.setInProgress(false);
                    analytics('donate', {
                        device: Device.brand,
                        success: 'true',
                    });
                })
                .catch((e) => {
                    Sentry.Native.withScope((scope) => {
                        scope.setTag('ipct-activity', 'donate');
                        Sentry.Native.captureException(e);
                    });
                    console.log(e);
                    analytics('donate', {
                        device: Device.brand,
                        success: 'false',
                    });
                    // TODO: 'nonce too low' have happened here!
                    Alert.alert(
                        i18n.t('generic.failure'),
                        i18n.t('donate.errorDonating'),
                        [
                            { text: 'Try again', onPress: () => executeTx() },
                            {
                                text: 'Go Back',
                                onPress: () => navigationRef.current?.goBack(),
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false }
                    );
                })
                .finally(() => this.setState({ donating: false }));
        executeTx();
    };

    render() {
        const {
            visible,
            dismissModal,
            // user,
            community,
            // confirmAmount,
            // goBack,
            // donateWithCeloWallet,
            amountDonate,
            amountInDollars,
            goBackToDonateModal,
            userCurrency,
        } = this.props;
        const { donating } = this.state;

        // const amountInDollars =
        //     parseFloat(formatInputAmountToTransfer(confirmAmount)) /
        //     this.props.user.exchangeRate;

        if (community === undefined) {
            return null;
        }

        return (
            <View>
                <Image
                    style={styles.cover}
                    source={{
                        uri: chooseMediaThumbnail(community.cover!, {
                            width: 330,
                            heigth: 183,
                        }),
                    }}
                />
                <View style={styles.darkerBackground} />

                <Text
                    style={{
                        marginHorizontal: 22,
                        marginBottom: 70,
                        fontSize: 14,
                        lineHeight: 24,
                        textAlign: 'center',
                    }}
                >
                    <Trans
                        i18nKey="donate.donateConfirmMessage"
                        values={{
                            symbol: getCurrencySymbol(userCurrency),
                            amount: amountDonate
                                .trim()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            amountInDollars: amountInDollars.toFixed(2),
                            to: community.name,
                        }}
                        components={{
                            bold: (
                                <Text
                                    style={{
                                        fontFamily: 'Gelion-Bold',
                                    }}
                                />
                            ),
                        }}
                    />
                </Text>
                <Button
                    style={{ width: '90%', alignSelf: 'center' }}
                    modeType="green"
                    labelStyle={styles.donateLabel}
                    loading={donating}
                    // disabled={}
                    onPress={() => {}}
                >
                    {i18n.t('donate.confirmContributionWithValora')}
                </Button>
            </View>
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
    cover: {
        width: '90%',
        height: 183,
        borderRadius: 12,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginVertical: 19,
        marginHorizontal: 20,
        alignSelf: 'center',
    },
    darkerBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 183,
    },
});

const mapStateToProps = (state: IRootState) => {
    const { kit } = state.app;
    const { address, currency } = state.user.metadata;
    const { inputAmount, amountInDollars } = state.modalDonate.donationValues;
    const { modalConfirmOpen, community } = state.modalDonate;
    return {
        kit,
        amountDonate: inputAmount,
        amountInDollars,
        userAddress: address,
        userCurrency: currency,
        visible: modalConfirmOpen,
        community,
    };
};

const mapDispatchToProps = (
    dispatch: Dispatch<ModalActionTypes | UserActionTypes>
) => {
    return {
        goBackToDonateModal: () =>
            dispatch({ type: modalDonateAction.GO_BACK_TO_DONATE }),
        dismissModal: () => dispatch({ type: modalDonateAction.CLOSE }),
        setInProgress: (inProgress: boolean) =>
            dispatch({
                type: modalDonateAction.IN_PROGRESS,
                payload: inProgress,
            }),
        updateUserBalance: (newBalance: string) =>
            dispatch(setUserWalletBalance(newBalance)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ConfirmModal);
