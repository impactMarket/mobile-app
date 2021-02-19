import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import CachedImage from 'components/CacheImage';
import CommuntyStatus from 'components/CommuntyStatus';
import ManageSvg from 'components/svg/ManageSvg';
import * as Linking from 'expo-linking';
import { updateCommunityInfo } from 'helpers/index';
import { ITabBarIconProps } from 'helpers/types/common';
import { ICommunity } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import Beneficiaries from './cards/Beneficiaries';
import Managers from './cards/Managers';

function CommunityManagerScreen() {
    const dispatch = useDispatch();

    const { i18n } = useTranslation();
    const kit = useSelector((state: IRootState) => state.app.kit);
    const communityContract = useSelector(
        (state: IRootState) => state.user.community.contract
    );
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    const [refreshing, setRefreshing] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );

    useEffect(() => {
        if (kit !== undefined && community.status === 'valid') {
            const loadCommunityBalance = async () => {
                const stableToken = await kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    communityContract._address
                );
                // at least five cents
                setHasFundsToNewBeneficiary(
                    new BigNumber(cUSDBalanceBig.toString()).gte(
                        '50000000000000000'
                    )
                );
            };
            loadCommunityBalance();
        }
    }, [community, kit]);

    const onRefresh = () => {
        updateCommunityInfo(community.publicId, dispatch).then(async () => {
            const stableToken = await kit.contracts.getStableToken();
            const cUSDBalanceBig = await stableToken.balanceOf(
                communityContract._address
            );
            // at least five cents
            setHasFundsToNewBeneficiary(
                new BigNumber(cUSDBalanceBig.toString()).gte(
                    '50000000000000000'
                )
            );
            setRefreshing(false);
        });
    };

    const communityStatus = (_community: ICommunity) => {
        if (_community.status === 'valid') {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            //refresh control used for the Pull to Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <BaseCommunity community={community}>
                        <View style={styles.container}>
                            <Beneficiaries
                                beneficiaries={_community.state.beneficiaries}
                                removedBeneficiaries={
                                    _community.state.removedBeneficiaries
                                }
                                hasFundsToNewBeneficiary={
                                    hasFundsToNewBeneficiary
                                }
                            />
                            <Managers managers={_community.state.managers} />
                            <CommuntyStatus community={_community} />
                        </View>
                    </BaseCommunity>
                </ScrollView>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <BaseCommunity community={_community} full>
                    <View
                        style={{
                            marginHorizontal: 20,
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <CachedImage
                            source={require('assets/images/pending.png')}
                            style={{ width: 50, height: 50 }}
                        />
                        <Headline
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 22,
                                lineHeight: 22,
                                height: 22,
                                letterSpacing: 0,
                                textAlign: 'center',
                            }}
                        >
                            {i18n.t('pendingApproval')}
                        </Headline>
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 19,
                                lineHeight: 19,
                                height: 100,
                                letterSpacing: 0,
                                textAlign: 'center',
                            }}
                        >
                            {i18n.t('pendingApprovalMessage')}{' '}
                            <Text
                                style={{ color: ipctColors.blueRibbon }}
                                onPress={() =>
                                    Linking.openURL(
                                        'mailto:hello@impactmarket.com'
                                    )
                                }
                            >
                                hello@impactmarket.com
                            </Text>
                        </Text>
                    </View>
                </BaseCommunity>
            </View>
        );
    };

    if (community === undefined) {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator
                    animating
                    size="large"
                    color={ipctColors.blueRibbon}
                />
            </View>
        );
    }

    return communityStatus(community);
}

CommunityManagerScreen.navigationOptions = () => {
    const { i18n } = useTranslation();
    return {
        title: i18n.t('manage'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <ManageSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 30,
    },
    imageBackground: {
        width: '100%',
        height: 147,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    communityName: {
        fontSize: 25,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        fontSize: 20,
        color: 'white',
    },
});

export default CommunityManagerScreen;
