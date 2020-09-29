import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import {
    iptcColors,
    getUserCurrencySymbol,
    updateCommunityInfo,
    formatInputAmountToTransfer,
} from 'helpers/index';
import { ICommunityInfo, IRootState } from 'helpers/types';
import React, { Component } from 'react';
import { StyleSheet, Clipboard, Alert } from 'react-native';
import {
    Button,
    Dialog,
    Paragraph,
    Portal,
    TextInput,
    Snackbar,
    Text,
} from 'react-native-paper';
import { ConnectedProps, connect } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';
import config from '../../../../config';

interface IExploreScreenProps {
    community: ICommunityInfo;
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
    donating: boolean;
    amountDonate: string;
    showCopiedToClipboard: boolean;
    modalConfirmSend: boolean;
}
BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
class Donate extends Component<Props, IDonateState> {
    constructor(props: any) {
        super(props);
        this.state = {
            openModalDonate: false,
            donating: false,
            amountDonate: '',
            showCopiedToClipboard: false,
            modalConfirmSend: false,
        };
    }

    handleConfirmDonateWithCeloWallet = () => {
        const { amountDonate } = this.state;
        const { community, user } = this.props;
        const inDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            this.props.user.user.exchangeRate;
        Alert.alert(
            i18n.t('donate'),
            i18n.t('payConfirmMessage', {
                symbol: getUserCurrencySymbol(user.user),
                amount: amountDonate,
                amountInDollars: inDollars.toFixed(2),
                to: community.name,
            }),
            [
                {
                    text: i18n.t('donate'),
                    onPress: () => this.donateWithCeloWallet(),
                },
                {
                    text: i18n.t('cancel'),
                },
            ],
            { cancelable: true }
        );
    };

    donateWithCeloWallet = async () => {
        this.setState({ donating: true });
        const stableToken = await this.props.app.kit.contracts.getStableToken();
        const cUSDDecimals = await stableToken.decimals();
        const inDollars =
            parseFloat(formatInputAmountToTransfer(this.state.amountDonate)) /
            this.props.user.user.exchangeRate;
        const txObject = stableToken.transfer(
            this.props.community.contractAddress,
            new BigNumber(inDollars)
                .multipliedBy(new BigNumber(10).pow(cUSDDecimals))
                .toString()
        ).txo;
        const requestId = 'donatetocommunity';
        celoWalletRequest(
            this.props.user.celoInfo.address,
            stableToken.address,
            txObject,
            requestId,
            this.props.app.kit
        )
            .then(() => {
                // update donated values
                setTimeout(
                    () =>
                        updateCommunityInfo(
                            this.props.user.celoInfo.address,
                            this.props
                        ),
                    10000
                );

                Alert.alert(
                    i18n.t('success'),
                    i18n.t('youHaveDonated'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .catch(() => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorDonating'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                this.setState({
                    openModalDonate: false,
                    donating: false,
                    amountDonate: '',
                });
            });
    };

    handleCopyAddressToClipboard = () => {
        Clipboard.setString(this.props.community.contractAddress);
        this.setState({ showCopiedToClipboard: true });
        setTimeout(() => this.setState({ showCopiedToClipboard: false }), 5000);
        this.setState({ openModalDonate: false });
    };

    render() {
        const {
            openModalDonate,
            donating,
            amountDonate,
            showCopiedToClipboard,
        } = this.state;
        const { community, user } = this.props;

        const amoutToDonateInDollars =
            parseFloat(formatInputAmountToTransfer(this.state.amountDonate)) /
            this.props.user.user.exchangeRate;

        return (
            <>
                <Button
                    mode="contained"
                    style={styles.donate}
                    onPress={() => this.setState({ openModalDonate: true })}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        {i18n.t('donate')}
                    </Text>
                </Button>
                <Snackbar
                    visible={showCopiedToClipboard}
                    onDismiss={() => {}}
                    action={{
                        label: '',
                        onPress: () => {
                            // Do something
                        },
                    }}
                >
                    {i18n.t('addressCopiedClipboard')}
                </Snackbar>
                <Portal>
                    <Dialog
                        visible={openModalDonate}
                        onDismiss={() =>
                            this.setState({ openModalDonate: false })
                        }
                    >
                        <Dialog.Title>{i18n.t('donate')}</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label={i18n.t('amountSymbol', {
                                    symbol: getUserCurrencySymbol(user.user),
                                })}
                                mode="outlined"
                                keyboardType="numeric"
                                value={amountDonate}
                                onChangeText={(text) =>
                                    this.setState({ amountDonate: text })
                                }
                            />
                            <Paragraph style={{ marginBottom: 20 }}>
                                {i18n.t('yourDonationWillBack', {
                                    backNBeneficiaries: Math.floor(
                                        amoutToDonateInDollars /
                                            new BigNumber(
                                                community.vars._claimAmount
                                            )
                                                .dividedBy(
                                                    10 ** config.cUSDDecimals
                                                )
                                                .toNumber()
                                    ),
                                })}
                            </Paragraph>
                            <Button
                                mode="contained"
                                onPress={this.handleCopyAddressToClipboard}
                            >
                                {i18n.t('copyToClipboard')}
                            </Button>
                            <Button
                                mode="contained"
                                loading={donating}
                                disabled={donating}
                                style={{ marginRight: 10 }}
                                onPress={this.handleConfirmDonateWithCeloWallet}
                            >
                                {i18n.t('donate')}
                            </Button>
                            <Button
                                mode="contained"
                                onPress={() =>
                                    this.setState({ openModalDonate: false })
                                }
                            >
                                {i18n.t('close')}
                            </Button>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </>
        );
    }
}

const styles = StyleSheet.create({
    donate: {
        borderRadius: 0,
        backgroundColor: iptcColors.greenishTeal,
        height: '7%',
    },
});

export default connector(Donate);
