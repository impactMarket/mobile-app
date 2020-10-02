import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import {
    iptcColors,
    updateCommunityInfo,
    formatInputAmountToTransfer,
    getCurrencySymbol,
} from 'helpers/index';
import { ICommunityInfo, IRootState } from 'helpers/types';
import React, { Component } from 'react';
import { StyleSheet, Clipboard, Alert, View, TextInput } from 'react-native';
import {
    Button,
    Paragraph,
    Portal,
    Snackbar,
    Text,
    Modal,
    Headline,
    IconButton,
    Card,
} from 'react-native-paper';
import { ConnectedProps, connect } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';
import { writeLog } from 'services/logger';
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
    rates: any;
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
            rates: this.props.app.exchangeRates,
        };
    }

    handleConfirmDonateWithCeloWallet = () => {
        const { amountDonate } = this.state;
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            this.props.user.user.exchangeRate;
        if (
            amountInDollars >
            new BigNumber(this.props.user.celoInfo.balance)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber()
        ) {
            Alert.alert(
                i18n.t('donate'),
                i18n.t('donationBiggerThanBalance'),
                [{ text: i18n.t('close') }],
                { cancelable: true }
            );
            return;
        }
        const { community, user } = this.props;
        Alert.alert(
            i18n.t('donate'),
            i18n.t('donateConfirmMessage', {
                symbol: getCurrencySymbol(user.user.currency),
                amount: amountDonate,
                amountInDollars: amountInDollars.toFixed(2),
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
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(this.state.amountDonate)) /
            this.props.user.user.exchangeRate;
        const txObject = stableToken.transfer(
            this.props.community.contractAddress,
            new BigNumber(amountInDollars)
                .multipliedBy(new BigNumber(10).pow(cUSDDecimals))
                .toString()
        ).txo;
        celoWalletRequest(
            this.props.user.celoInfo.address,
            stableToken.address,
            txObject,
            'donatetocommunity',
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
            .catch((e) => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorDonating'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                writeLog({ action: 'donate', details: e });
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
            rates,
        } = this.state;
        const { community, user } = this.props;

        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            this.props.user.user.exchangeRate;
        const amountInCommunityCurrency =
            amountInDollars * rates[community.currency].rate;

        let donatingModalString = '';
        const backForDays =
            amountInDollars /
            new BigNumber(community.vars._claimAmount)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber() /
            community.beneficiaries.added.length;
        if (backForDays < 1) {
            donatingModalString = i18n.t('yourDonationWillBack', {
                backNBeneficiaries: Math.max(
                    1,
                    Math.floor(
                        amountInDollars /
                            new BigNumber(community.vars._claimAmount)
                                .dividedBy(10 ** config.cUSDDecimals)
                                .toNumber()
                    )
                ),
            });
        } else {
            donatingModalString = i18n.t('yourDonationWillBackFor', {
                backNBeneficiaries: community.beneficiaries.added.length,
                backForDays: Math.floor(backForDays),
            });
        }

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
                    <Modal
                        visible={openModalDonate}
                        onDismiss={() =>
                            this.setState({ openModalDonate: false })
                        }
                    >
                        <Card style={{ marginHorizontal: 20 }}>
                            <Card.Content>
                                <View style={{ height: 40 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Headline style={{ marginVertical: 3 }}>
                                            {i18n.t('donateSymbol', {
                                                symbol: user.user.currency,
                                            })}
                                        </Headline>
                                        <IconButton
                                            icon="close"
                                            size={20}
                                            style={{ top: -5 }}
                                            onPress={() =>
                                                this.setState({
                                                    openModalDonate: false,
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        backgroundColor: '#F6F6F7',
                                        // opacity: 0.27,
                                        alignItems: 'center',
                                        borderRadius: 5,
                                    }}
                                >
                                    <TextInput
                                        keyboardType="numeric"
                                        placeholder={i18n.t('amountSymbol', {
                                            symbol: getCurrencySymbol(
                                                user.user.currency
                                            ),
                                        })}
                                        style={{
                                            fontFamily: 'Gelion-Regular',
                                            fontStyle: 'normal',
                                            fontWeight: 'normal',
                                            fontSize: 40,
                                            lineHeight: 50,
                                            textAlign: 'center',
                                        }}
                                        value={amountDonate}
                                        onChangeText={(text) =>
                                            this.setState({
                                                amountDonate: text,
                                            })
                                        }
                                    />
                                    {amountDonate.length > 0 && (
                                        <Paragraph
                                            style={{ marginVertical: 10 }}
                                        >
                                            ~
                                            {`${getCurrencySymbol(
                                                community.currency
                                            )}${amountInCommunityCurrency.toFixed(
                                                2
                                            )}${community.currency}`}
                                        </Paragraph>
                                    )}
                                </View>
                                {amountDonate.length > 0 && (
                                    <Paragraph
                                        style={{
                                            marginBottom: 20,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {donatingModalString}
                                    </Paragraph>
                                )}
                                <Button
                                    style={{
                                        backgroundColor: '#F2F3F5',
                                        marginVertical: 10,
                                    }}
                                    mode="contained"
                                    onPress={this.handleCopyAddressToClipboard}
                                >
                                    <Text
                                        style={{
                                            color: 'black',
                                            textTransform: 'none',
                                        }}
                                    >
                                        {i18n.t('copyContractAddress')}
                                    </Text>
                                </Button>
                                <Button
                                    mode="contained"
                                    loading={donating}
                                    disabled={donating}
                                    onPress={
                                        this.handleConfirmDonateWithCeloWallet
                                    }
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            textTransform: 'none',
                                        }}
                                    >
                                        {i18n.t('donateWithValora')}
                                    </Text>
                                </Button>
                            </Card.Content>
                        </Card>
                    </Modal>
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
