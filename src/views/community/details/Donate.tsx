import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import {
    updateCommunityInfo,
    formatInputAmountToTransfer,
    getCurrencySymbol,
    iptcColors,
} from 'helpers/index';
import { ICommunityInfo, IRootState } from 'helpers/types';
import React, { Component } from 'react';
import {
    StyleSheet,
    Clipboard,
    Alert,
    View,
    TextInput,
    Dimensions,
    Keyboard,
    LayoutAnimation,
    Platform,
} from 'react-native';
import {
    Paragraph,
    Portal,
    Snackbar,
    Modal,
    Headline,
    IconButton,
} from 'react-native-paper';
import { ConnectedProps, connect } from 'react-redux';
import { analytics } from 'services/analytics';
import { celoWalletRequest } from 'services/celoWallet';
import config from '../../../../config';
import * as Device from 'expo-device';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import Api from 'services/api';

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
    keyboardOpen: boolean;
    bottom: number;
}
BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
class Donate extends Component<Props, IDonateState> {
    private keyboardShowListener: any;
    private keyboardHideListener: any;

    constructor(props: any) {
        super(props);
        this.state = {
            openModalDonate: false,
            donating: false,
            amountDonate: '',
            showCopiedToClipboard: false,
            modalConfirmSend: false,
            rates: this.props.app.exchangeRates,
            keyboardOpen: false,
            bottom: 0,
        };
    }

    componentDidMount() {
        this.keyboardShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardShow
        );
        this.keyboardHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardHide
        );
    }

    componentWillUnmount() {
        this.keyboardShowListener && this.keyboardShowListener.remove();
        this.keyboardHideListener && this.keyboardHideListener.remove();
    }

    keyboardShow = (e: any) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ keyboardOpen: true, bottom: e.endCoordinates.height });
    };

    keyboardHide = (e: any) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ keyboardOpen: false, bottom: 0 });
    };

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
                amount: amountDonate.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
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
            .then((tx) => {
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
                analytics('donate', { device: Device.brand, success: true });
            })
            .catch((e) => {
                Api.uploadError(this.props.user.celoInfo.address, 'donate', e);
                analytics('donate', { device: Device.brand, success: false });
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
            rates,
            keyboardOpen,
            bottom,
        } = this.state;
        const { community, user } = this.props;

        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            this.props.user.user.exchangeRate;
        const amountInCommunityCurrency =
            amountInDollars * rates[community.currency].rate;

        const backForDays =
            amountInDollars /
            new BigNumber(community.vars._claimAmount)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber() /
            community.beneficiaries.added.length;

        const donateWithValoraButton =
            user.celoInfo.address.length > 0 ? (
                <Button
                    modeType="default"
                    bold={true}
                    loading={donating}
                    disabled={donating}
                    onPress={this.handleConfirmDonateWithCeloWallet}
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

        // yeah, modals on iOS get hidden below the keyboard
        let cardModalStyle = {};
        if (Platform.OS === 'ios') {
            cardModalStyle = {
                ...cardModalStyle,
                position: 'absolute',
                width: Dimensions.get('window').width - 40,
            };
            if (keyboardOpen) {
                cardModalStyle = {
                    ...cardModalStyle,
                    bottom: bottom - 255,
                };
            }
        }
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
                        // backgroundColor: 'red',
                    }}
                    onPress={() => this.setState({ openModalDonate: true })}
                >
                    {i18n.t('donate')}
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
                        <Card
                            style={{
                                marginHorizontal: 20,
                                ...cardModalStyle,
                            }}
                        >
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
                                        padding: 13,
                                    }}
                                >
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
                                    <View style={{ height: 19 }}>
                                        <Paragraph
                                            style={{
                                                fontSize: 16,
                                                lineHeight: 19,
                                                height: 19,
                                                color: 'rgba(0, 0, 0, 0.6)',
                                                display:
                                                    amountDonate.length > 0
                                                        ? 'flex'
                                                        : 'none',
                                            }}
                                        >
                                            ~
                                            {`${getCurrencySymbol(
                                                community.currency
                                            )}${(
                                                Math.floor(
                                                    amountInCommunityCurrency *
                                                        100
                                                ) / 100
                                            )
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )} ${community.currency}`}
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
                                            height:
                                                19 * 2 /** TODO: fix height */,
                                            textAlign: 'center',
                                            fontStyle: 'italic',
                                            color: iptcColors.textGray,
                                            display:
                                                amountDonate.length === 0 ||
                                                new BigNumber(
                                                    community.vars._claimAmount
                                                )
                                                    .dividedBy(
                                                        10 **
                                                            config.cUSDDecimals
                                                    )
                                                    .gt(amountInDollars)
                                                    ? 'flex'
                                                    : 'none',
                                        }}
                                    >
                                        {i18n.t('amountShouldBe', {
                                            claimAmount: parseFloat(
                                                new BigNumber(
                                                    community.vars._claimAmount
                                                )
                                                    .dividedBy(
                                                        10 **
                                                            config.cUSDDecimals
                                                    )
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
                                                    community.vars._claimAmount
                                                )
                                                    .dividedBy(
                                                        10 **
                                                            config.cUSDDecimals
                                                    )
                                                    .lte(amountInDollars)
                                                    ? 'flex'
                                                    : 'none',
                                        }}
                                    >
                                        {i18n.t('yourDonationWillBackFor', {
                                            backNBeneficiaries: Math.min(
                                                community.beneficiaries.added
                                                    .length,
                                                amountDonate.length > 0
                                                    ? Math.floor(
                                                          amountInDollars /
                                                              new BigNumber(
                                                                  community.vars._claimAmount
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
                                                    ? Math.max(
                                                          1,
                                                          Math.floor(
                                                              backForDays
                                                          )
                                                      )
                                                    : 0,
                                        })}
                                    </Paragraph>
                                </View>
                                <Button
                                    modeType="gray"
                                    bold={true}
                                    style={{
                                        // backgroundColor: '#F2F3F5',
                                        marginBottom: 10,
                                    }}
                                    onPress={this.handleCopyAddressToClipboard}
                                >
                                    {i18n.t('copyContractAddress')}
                                </Button>
                                {donateWithValoraButton}
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
        height: 69,
    },
});

export default connector(Donate);
