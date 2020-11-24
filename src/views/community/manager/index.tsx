import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import CommuntyStatus from 'components/CommuntyStatus';
import * as Linking from 'expo-linking';
import { updateCommunityInfo } from 'helpers/index';
import { iptcColors } from 'styles/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Button,
    Dialog,
    Portal,
    Headline,
    ActivityIndicator,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Beneficiaries from './cards/Beneficiaries';
import { Screens } from 'helpers/constants';

function CommunityManagerScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const kit = useSelector((state: IRootState) => state.app.kit);
    const communityContract = useSelector(
        (state: IRootState) => state.network.contracts.communityContract
    );
    const community = useSelector(
        (state: IRootState) => state.network.community
    );

    const [openModalMore, setOpenModalMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );

    useEffect(() => {
        const loadCommunityBalance = async () => {
            if (kit !== undefined) {
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
            }
        };
        loadCommunityBalance();
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

    const communityStatus = (_community: ICommunityInfo) => {
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
                                community={_community}
                                hasFundsToNewBeneficiary={
                                    hasFundsToNewBeneficiary
                                }
                                // updateCommunity={(_communityUpdate) =>
                                //     setCommunity(_communityUpdate)
                                // }
                            />
                            <CommuntyStatus community={_community} />
                        </View>
                    </BaseCommunity>
                </ScrollView>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <BaseCommunity community={_community} full={true}>
                    <View
                        style={{
                            marginHorizontal: 20,
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Image
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
                                style={{ color: iptcColors.softBlue }}
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
                    animating={true}
                    size="large"
                    color={iptcColors.softBlue}
                />
            </View>
        );
    }

    return (
        <>
            {/* <Header title={i18n.t('manage')} navigation={navigation}>
                {community.status === 'valid' && (
                    <IconButton
                        icon="dots-horizontal"
                        style={{ backgroundColor: '#eaedf0' }}
                        onPress={() => setOpenModalMore(true)}
                    />
                )}
            </Header> */}
            {communityStatus(community)}
            <Portal>
                <Dialog
                    visible={openModalMore}
                    onDismiss={() => setOpenModalMore(false)}
                >
                    <Dialog.Content>
                        <Button
                            mode="outlined"
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                setOpenModalMore(false);
                                navigation.navigate(Screens.CreateCommunity, {
                                    community,
                                });
                            }}
                        >
                            {i18n.t('editCommunityDetails')}
                        </Button>
                        <Button
                            mode="outlined"
                            style={{ marginVertical: 10 }}
                            onPress={() => {
                                setOpenModalMore(false);
                                navigation.navigate(Screens.CommunityDetails, {
                                    community,
                                });
                            }}
                        >
                            {i18n.t('viewAsPublic')}
                        </Button>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </>
    );
}

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
