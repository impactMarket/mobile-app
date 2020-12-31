import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { updateCommunityInfo } from 'helpers/index';
import {
    formatInputAmountToTransfer,
    getCurrencySymbol,
} from 'helpers/currency';
import { iptcColors } from 'styles/index';
import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    View,
    TextInput,
    Dimensions,
    Keyboard,
    LayoutAnimation,
    Platform,
    Pressable,
    Text,
} from 'react-native';
import {
    Paragraph,
    Portal,
    Snackbar,
    Modal,
    Headline,
} from 'react-native-paper';
import Clipboard from 'expo-clipboard';
import { ConnectedProps, connect } from 'react-redux';
import { analytics } from 'services/analytics';
import { celoWalletRequest } from 'services/celoWallet';
import config from '../../../../config';
import * as Device from 'expo-device';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import Api from 'services/api';
import CloseSvg from 'components/svg/CloseSvg';
import { ICommunity } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';

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
    donating: boolean;
    amountDonate: string;
    showCopiedToClipboard: boolean;
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
            modalConfirmSend: false,
            modalError: false,
            donating: false,
            amountDonate: '',
            showCopiedToClipboard: false,
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
            this.props.user.exchangeRate;
        if (
            amountInDollars >
            new BigNumber(this.props.user.wallet.balance)
                .dividedBy(10 ** config.cUSDDecimals)
                .toNumber()
        ) {
            // Alert.alert(
            //     i18n.t('donate'),
            //     i18n.t('donationBiggerThanBalance'),
            //     [{ text: i18n.t('close') }],
            //     { cancelable: true }
            // );
            // return;
            this.setState({ openModalDonate: false, modalError: true });
        } else {
            this.setState({ openModalDonate: false, modalConfirmSend: true });
        }
    };

    donateWithCeloWallet = async () => {
        this.setState({ donating: true });
        const stableToken = await this.props.app.kit.contracts.getStableToken();
        const cUSDDecimals = await stableToken.decimals();
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(this.state.amountDonate)) /
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
                // console.log('tx', tx);
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
        Clipboard.setString(
            this.props.community.contractAddress!
        );
        this.setState({ showCopiedToClipboard: true });
        setTimeout(() => this.setState({ showCopiedToClipboard: false }), 5000);
        this.setState({ openModalDonate: false });
    };

    render() {
        const {
            openModalDonate,
            modalConfirmSend,
            modalError,
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
                            this.setState({
                                openModalDonate: false,
                                amountDonate: '',
                            })
                        }
                    >
                        <Card
                            style={{
                                marginHorizontal: 20,
                                ...cardModalStyle,
                            }}
                        >
                            <Card.Content>
                                <View
                                    style={{
                                        height: 24,
                                        marginTop: 4,
                                        marginBottom: 19,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Headline
                                            style={{
                                                fontFamily: 'Gelion-Bold',
                                                fontSize: 24,
                                                lineHeight: 24,
                                            }}
                                        >
                                            {i18n.t('donateSymbol', {
                                                symbol: user.metadata.currency,
                                            })}
                                        </Headline>
                                        <Pressable
                                            hitSlop={15}
                                            onPress={() =>
                                                this.setState({
                                                    openModalDonate: false,
                                                    amountDonate: '',
                                                })
                                            }
                                        >
                                            <CloseSvg />
                                        </Pressable>
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
                                                this.props.user.metadata
                                                    .currency
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
                                                    amountInDollars *
                                                        rates[
                                                            community.currency
                                                        ].rate *
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
                                                    community.contract.claimAmount
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
                                                    community.contract.claimAmount
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
                                                    community.contract.claimAmount
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
                                    style={{ marginBottom: 10 }}
                                    labelStyle={styles.donateLabel}
                                    onPress={this.handleCopyAddressToClipboard}
                                >
                                    {i18n.t('copyContractAddress')}
                                </Button>
                                {donateWithValoraButton}
                            </Card.Content>
                        </Card>
                    </Modal>
                    <Modal
                        visible={modalConfirmSend}
                        onDismiss={() =>
                            this.setState({
                                modalConfirmSend: false,
                                amountDonate: '',
                            })
                        }
                    >
                        <Card
                            style={{
                                marginHorizontal: 20,
                                ...cardModalStyle,
                            }}
                        >
                            <Card.Content>
                                <View
                                    style={{
                                        height: 24,
                                        marginTop: 4,
                                        marginBottom: 19,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Headline
                                            style={{
                                                fontFamily: 'Gelion-Bold',
                                                fontSize: 24,
                                                lineHeight: 24,
                                            }}
                                        >
                                            {i18n.t('donateSymbol', {
                                                symbol: user.metadata.currency,
                                            })}
                                        </Headline>
                                        <Pressable
                                            hitSlop={15}
                                            onPress={() =>
                                                this.setState({
                                                    openModalDonate: false,
                                                    amountDonate: '',
                                                })
                                            }
                                        >
                                            <CloseSvg />
                                        </Pressable>
                                    </View>
                                </View>
                                <Paragraph
                                    style={{
                                        marginHorizontal: 44,
                                        marginVertical: 50,
                                        fontSize: 19,
                                        lineHeight: 23,
                                        textAlign: 'center',
                                    }}
                                >
                                    {i18n.t('donateConfirmMessage', {
                                        symbol: getCurrencySymbol(
                                            user.metadata.currency
                                        ),
                                        amount: amountDonate.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                        ),
                                        amountInDollars: amountInDollars.toFixed(
                                            2
                                        ),
                                        to: community.name,
                                    })}
                                </Paragraph>
                                <View
                                    style={{
                                        height: 42 /** TODO: this is currently th buttons height */,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 2,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Button
                                            modeType="gray"
                                            bold={true}
                                            style={{
                                                marginRight: 14.48,
                                                flex: 1,
                                            }}
                                            labelStyle={styles.donateLabel}
                                            onPress={() =>
                                                this.setState({
                                                    openModalDonate: true,
                                                    modalConfirmSend: false,
                                                })
                                            }
                                        >
                                            {i18n.t('backWithSymbol')}
                                        </Button>
                                        <Button
                                            modeType="default"
                                            bold={true}
                                            style={{ flex: 1 }}
                                            loading={donating}
                                            labelStyle={styles.donateLabel}
                                            onPress={() =>
                                                this.donateWithCeloWallet()
                                            }
                                        >
                                            {i18n.t('donate')}
                                        </Button>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </Modal>
                    <Modal
                        visible={modalError}
                        onDismiss={() =>
                            this.setState({
                                modalError: false,
                                amountDonate: '',
                            })
                        }
                    >
                        <Card
                            style={{
                                marginHorizontal: 20,
                                ...cardModalStyle,
                            }}
                        >
                            <Card.Content>
                                <View
                                    style={{
                                        height: 24,
                                        marginTop: 4,
                                        marginBottom: 19,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Headline
                                            style={{
                                                fontFamily: 'Gelion-Bold',
                                                fontSize: 24,
                                                lineHeight: 24,
                                            }}
                                        >
                                            {i18n.t('donateSymbol', {
                                                symbol: user.metadata.currency,
                                            })}
                                        </Headline>
                                        <Pressable
                                            hitSlop={15}
                                            onPress={() =>
                                                this.setState({
                                                    modalError: false,
                                                    amountDonate: '',
                                                })
                                            }
                                        >
                                            <CloseSvg />
                                        </Pressable>
                                    </View>
                                </View>
                                <Paragraph
                                    style={{
                                        marginHorizontal: 44,
                                        marginVertical: 50,
                                        fontSize: 19,
                                        lineHeight: 23,
                                        textAlign: 'center',
                                    }}
                                >
                                    {i18n.t('donationBiggerThanBalance')}
                                </Paragraph>
                                <Button
                                    modeType="gray"
                                    bold={true}
                                    style={{}}
                                    labelStyle={styles.donateLabel}
                                    onPress={() =>
                                        this.setState({
                                            openModalDonate: true,
                                            modalError: false,
                                        })
                                    }
                                >
                                    {i18n.t('backWithSymbol')}
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
        height: 69,
    },
    donateLabel: {
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.3,
    },
});

export default connector(Donate);
