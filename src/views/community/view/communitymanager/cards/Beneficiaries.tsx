import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import {
    ICommunityInfo,
    IStoreCombinedActionsTypes,
    IStoreCombinedState,
} from 'helpers/types';
import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Card, Headline } from 'react-native-paper';
import { useStore } from 'react-redux';

import { BigNumber } from 'bignumber.js';
import Button from 'components/Button';

interface IBeneficiariesProps {
    community: ICommunityInfo;
}

function Beneficiaries(props: IBeneficiariesProps) {
    const navigation = useNavigation();
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const { app, network } = store.getState();
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );

    // TODO: add here a method to be called when page is refreshed

    useEffect(() => {
        const loadCommunityBalance = async () => {
            if (app.kit.contracts !== undefined) {
                const stableToken = await app.kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    network.contracts.communityContract._address
                );
                // at least five cents
                setHasFundsToNewBeneficiary(
                    new BigNumber(cUSDBalanceBig.toString()).gte(
                        '50000000000000000'
                    )
                );
            }
        };
        loadCommunityBalance();
    }, [app.kit]);

    return (
        <View>
            <Card elevation={8}>
                <Card.Content>
                    <Headline
                        style={{
                            opacity: 0.48,
                            fontFamily: 'Gelion-Bold',
                            fontSize: 13,
                            fontWeight: '500',
                            fontStyle: 'normal',
                            lineHeight: 12,
                            letterSpacing: 0.7,
                        }}
                    >
                        {i18n.t('beneficiaries').toUpperCase()}
                    </Headline>
                    <Button
                        modeType="gray"
                        disabled={
                            props.community.beneficiaries.added.length === 0
                        }
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate('AddedScreen', {
                                beneficiaries:
                                    props.community.beneficiaries.added,
                            })
                        }
                    >
                        {i18n.t('added')} (
                        {props.community.beneficiaries.added.length})
                    </Button>
                    <Button
                        modeType="gray"
                        disabled={
                            props.community.beneficiaries.removed.length === 0
                        }
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate('RemovedScreen', {
                                beneficiaries:
                                    props.community.beneficiaries.removed,
                            })
                        }
                    >
                        {i18n.t('removed')} (
                        {props.community.beneficiaries.removed.length})
                    </Button>
                    <View>
                        {hasFundsToNewBeneficiary ? (
                            <Button
                                modeType="green"
                                style={{
                                    marginVertical: 5,
                                }}
                                onPress={() =>
                                    navigation.navigate('AddBeneficiaryScreen')
                                }
                            >
                                {i18n.t('addBeneficiary')}
                            </Button>
                        ) : (
                            <Button
                                modeType="default"
                                icon="alert"
                                style={{
                                    marginVertical: 5,
                                    backgroundColor: '#f0ad4e',
                                }}
                                onPress={() => {
                                    Alert.alert(
                                        i18n.t('noFunds'),
                                        i18n.t('notFundsToAddBeneficiary'),
                                        [{ text: i18n.t('close') }],
                                        { cancelable: false }
                                    );
                                }}
                            >
                                {i18n.t('addBeneficiary')}
                            </Button>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}

export default Beneficiaries;
