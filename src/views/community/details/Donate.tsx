import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { updateCommunityInfo } from 'helpers/index';
import {
    formatInputAmountToTransfer,
} from 'helpers/currency';
import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
} from 'react-native';
import {
    Portal,
} from 'react-native-paper';

import { ConnectedProps, connect } from 'react-redux';
import { analytics } from 'services/analytics';
import { celoWalletRequest } from 'services/celoWallet';
import config from '../../../../config';
import * as Device from 'expo-device';
import Button from 'components/core/Button';
import Api from 'services/api';
import { ICommunity } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import DonateModal from './donate/modals/donate';
import ConfirmModal from './donate/modals/confirm';
import ErrorModal from './donate/modals/error';

interface IExploreScreenProps {
    community: ICommunity;
}
const mapStateToProps = (state: IRootState) => {
    const { user, app } = state;
    return { user, app };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IExploreScreenProps;

interface IDonateState {
    openModalDonate: boolean;
    modalConfirmSend: boolean;
    modalError: boolean;
    confirmAmount: string;
}
BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
class Donate extends Component<Props, IDonateState> {
    constructor(props: any) {
        super(props);
        this.state = {
            openModalDonate: false,
            modalConfirmSend: false,
            modalError: false,
            confirmAmount: '',
        };
    }

    handleConfirmDonateWithCeloWallet = (amount: string) => {
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amount)) /
            this.props.user.exchangeRate;
        if (
            amountInDollars >
            new BigNumber(this.props.user.wallet.balance)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber()
        ) {
            this.setState({ openModalDonate: false, modalError: true });
        } else {
            this.setState({
                openModalDonate: false,
                modalConfirmSend: true,
                confirmAmount: amount,
            });
        }
    };

    donateWithCeloWallet = async () => {
        // this.setState({ donating: true });
        const stableToken = await this.props.app.kit.contracts.getStableToken();
        const cUSDDecimals = await stableToken.decimals();
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(this.state.confirmAmount)) /
            this.props.user.exchangeRate;
        const txObject = stableToken.transfer(
            this.props.community.contractAddress!,
            new BigNumber(amountInDollars)
                .multipliedBy(new BigNumber(10).pow(cUSDDecimals))
                .toString()
        ).txo;
        celoWalletRequest(
            this.props.user.wallet.address,
            stableToken.address,
            txObject,
            'donatetocommunity',
            this.props.app.kit
        )
            .then((tx) => {
                console.log('tx', tx);
                // TODO: open window confirming donation
                this.setState({ modalConfirmSend: false });
                if (tx === undefined) {
                    return;
                }
                // TODO: wait for tx confirmation and request UI update
                // update donated values
                setTimeout(
                    () =>
                        updateCommunityInfo(
                            this.props.community.publicId,
                            this.props.dispatch
                        ),
                    10000
                );

                Alert.alert(
                    i18n.t('success'),
                    i18n.t('youHaveDonated'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                analytics('donate', { device: Device.brand, success: 'true' });
                this.setState({
                    modalConfirmSend: false,
                    openModalDonate: false,
                    // donating: false,
                    // amountDonate: '',
                });
            })
            .catch((e) => {
                Api.uploadError(this.props.user.wallet.address, 'donate', e);
                analytics('donate', { device: Device.brand, success: 'false' });
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorDonating'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                // this.setState({ donating: false });
            });
    };

    render() {
        const {
            openModalDonate,
            modalConfirmSend,
            modalError,
            confirmAmount,
        } = this.state;
        const { community, user } = this.props;

        return (
            <>
                <Button
                    modeType="green"
                    bold={true}
                    style={styles.donate}
                    labelStyle={{
                        fontSize: 20,
                        lineHeight: 23,
                        color: 'white',
                    }}
                    onPress={() =>
                        this.setState({
                            openModalDonate: true,
                            confirmAmount: '',
                        })
                    }
                >
                    {i18n.t('donate')}
                </Button>
                <Portal>
                    <DonateModal
                        visible={openModalDonate}
                        onDismiss={() =>
                            this.setState({ openModalDonate: false })
                        }
                        user={user}
                        rates={this.props.app.exchangeRates}
                        community={community}
                        handleConfirmDonateWithCeloWallet={
                            this.handleConfirmDonateWithCeloWallet
                        }
                    />
                    <ConfirmModal
                        visible={modalConfirmSend}
                        onDismiss={() =>
                            this.setState({ modalConfirmSend: false })
                        }
                        user={user}
                        community={community}
                        confirmAmount={confirmAmount}
                        donateWithCeloWallet={this.donateWithCeloWallet}
                        goBack={() =>
                            this.setState({
                                openModalDonate: true,
                                modalConfirmSend: false,
                            })
                        }
                    />
                    <ErrorModal
                        visible={modalError}
                        onDismiss={() => this.setState({ modalError: false })}
                        user={user}
                        goBack={() =>
                            this.setState({
                                openModalDonate: true,
                                modalError: false,
                            })
                        }
                    />
                </Portal>
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

export default connector(Donate);
