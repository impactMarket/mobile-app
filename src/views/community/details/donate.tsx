import {
    Body,
    Button,
    ButtonText,
    colors,
    WarningIcon,
} from '@impact-market/ui-kit';
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
import { getUserBalance } from 'helpers/index';
import { setUserWalletBalance } from 'helpers/redux/actions/user';
import { ModalActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { Component, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, TextInput } from 'react-native';
import { Paragraph, Snackbar } from 'react-native-paper';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

import config from '../../../../config';
import CommunityContractABI from '../../../contracts/CommunityABI.json';
import DonationMinerABI from '../../../contracts/DonationMinerABI.json';

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });

function DonateView() {
    const [donating, setDonating] = useState(false);
    const [approving, setApproving] = useState(false);
    const [amountDonate, setAmountDonate] = useState('');
    const [approved, setApproved] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const dispatch = useDispatch();

    const { exchangeRates, kit } = useSelector(
        (state: IRootState) => state.app
    );
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const { exchangeRate } = useSelector((state: IRootState) => state.user);
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const userAddress = useSelector(
        (state: IRootState) => state.user.metadata.address
    );
    const userBalance = useSelector(
        (state: IRootState) => state.user.wallet.balance
    );

    useEffect(() => {
        if (community) {
            // eslint-disable-next-line no-inner-declarations
            async function update() {
                const communityContract = new kit.web3.eth.Contract(
                    CommunityContractABI as any,
                    community.contractAddress!
                );
                const isNewCommunity = await communityContract.methods
                    .impactMarketAddress()
                    .call();
                if (
                    isNewCommunity ===
                    '0x0000000000000000000000000000000000000000'
                ) {
                    setIsNew(true);
                    console.log('1');
                }
            }
            update();
        }
    }, [community]);

    const approve = async () => {
        if (community === undefined) {
            return;
        }
        const amountInDollars =
            parseFloat(formatInputAmountToTransfer(amountDonate)) /
            exchangeRate;
        // no need to check if enough for tx fee
        setApproving(true);

        let contractAddressTo = '';
        const cUSDAmount = new BigNumber(amountInDollars)
            .multipliedBy(new BigNumber(10).pow(18))
            .toString();

        const stableToken = await kit.contracts.getStableToken();
        const txObject = stableToken.approve(
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
        setApproving(false);
        setApproved(true);
    };

    const donate = async () => {
        if (community === undefined) {
            return;
        }
        // no need to check if enough for tx fee
        setDonating(true);

        let contractAddressTo = '';
        let txObject;
        const cUSDAmount = new BigNumber(amountInDollars)
            .multipliedBy(new BigNumber(10).pow(18))
            .toString();

        if (isNew) {
            const donationMiner = new kit.web3.eth.Contract(
                DonationMinerABI as any,
                config.donationMinerAddress
            );
            txObject = await donationMiner.methods.donateToCommunity(
                community.contractAddress!,
                cUSDAmount
            );
            contractAddressTo = config.donationMinerAddress;
        } else {
            const stableToken = await kit.contracts.getStableToken();
            txObject = stableToken.transfer(
                community.contractAddress!,
                cUSDAmount
            ).txo;
            contractAddressTo = stableToken.address;
        }

        const executeTx = () =>
            celoWalletRequest(
                userAddress,
                contractAddressTo,
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
                        dispatch(setUserWalletBalance(newBalanceStr));
                    }, 1200);
                })
                .catch((_) => {
                    Alert.alert(
                        i18n.t('generic.failure'),
                        i18n.t('donate.errorDonating'),
                        [
                            {
                                text: i18n.t('generic.tryAgain'),
                                onPress: () => executeTx(),
                            },
                            {
                                text: i18n.t('generic.cancel'),
                                onPress: () => {},
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false }
                    );
                })
                .finally(() => setDonating(false));
        executeTx();
    };

    if (
        community === undefined ||
        community.contract === undefined ||
        community.state === undefined
    ) {
        return null;
    }

    const amountInDollars =
        parseFloat(formatInputAmountToTransfer(amountDonate)) / exchangeRate;

    const backForDays =
        amountInDollars /
        new BigNumber(community.contract.claimAmount)
            .dividedBy(10 ** config.cUSDDecimals)
            .toNumber() /
        community.state.beneficiaries;

    const notEnoughBalance =
        amountInDollars >
        new BigNumber(userBalance)
            .dividedBy(10 ** config.cUSDDecimals)
            .toNumber();

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
                        onChangeText={setAmountDonate}
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
            {notEnoughBalance && (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 30,
                    }}
                >
                    <WarningIcon color={colors.ui.warning} />
                    <Body
                        style={{
                            // alignSelf: 'center',
                            marginLeft: 7,
                            lineHeight: 32,
                            fontSize: 14,
                        }}
                    >
                        Not enough funds to continue.
                    </Body>
                </View>
            )}
            {userAddress.length === 0 && (
                <View
                    style={{
                        marginTop: 60,
                        paddingVertical: 16,
                        paddingHorizontal: 22,
                    }}
                >
                    <Button mode="green" onPress={() => {}}>
                        Connect with Valora
                    </Button>
                    <View
                        style={{
                            margin: 8,
                            padding: 8,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <ButtonText style={{ color: colors.brand.primary }}>
                            What is Valora?
                        </ButtonText>
                        <ButtonText style={{ color: colors.brand.primary }}>
                            Copy Contract Address
                        </ButtonText>
                    </View>
                </View>
            )}
            {userAddress.length > 0 &&
                (isNew ? (
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
                                    approving ||
                                    amountDonate.length === 0 ||
                                    isNaN(parseInt(amountDonate, 10)) ||
                                    parseInt(amountDonate, 10) < 0 ||
                                    approved ||
                                    notEnoughBalance
                                }
                                onPress={approve}
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
                                onPress={donate}
                            >
                                {i18n.t('donate.donate')}
                            </Button>
                        </View>
                    </View>
                ) : (
                    <Button
                        mode={approved ? 'default' : 'gray'}
                        textStyle={styles.donateLabel}
                        // loading={donating}
                        style={{ margin: 22 }}
                        disabled={
                            donating ||
                            amountDonate.length === 0 ||
                            isNaN(parseInt(amountDonate, 10)) ||
                            parseInt(amountDonate, 10) < 0 ||
                            !approved
                        }
                    >
                        {i18n.t('donate.donate')}
                    </Button>
                ))}
        </>
    );
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

export default DonateView;
