import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import CommuntyStatus from 'components/CommuntyStatus';
import Header from 'components/Header';
import * as Linking from 'expo-linking';
import { updateCommunityInfo } from 'helpers/index';
import { iptcColors } from 'styles/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Button,
    IconButton,
    Dialog,
    Portal,
    Headline,
    ActivityIndicator,
} from 'react-native-paper';
import { connect, ConnectedProps, useDispatch } from 'react-redux';

import Beneficiaries from './cards/Beneficiaries';

const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function CommunityManagerView(props: Props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [community, setCommunity] = useState<ICommunityInfo>(
        props.network.community
    );
    const [openModalMore, setOpenModalMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );

    useEffect(() => {
        // cluncky issue after creating community
        if (props.network.community !== community) {
            setCommunity(props.network.community);
        }
        const loadCommunityBalance = async () => {
            if (props.app.kit.contracts !== undefined) {
                const stableToken = await props.app.kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    props.network.contracts.communityContract._address
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
    }, [props.network.community]);

    const onRefresh = () => {
        let contractAddress;
        if (props.network.contracts.communityContract !== undefined) {
            contractAddress =
                props.network.contracts.communityContract._address;
        } else if (props.network.community !== undefined) {
            contractAddress = props.network.community.contractAddress;
        }
        if (contractAddress !== undefined && contractAddress !== null) {
            updateCommunityInfo(community.publicId, dispatch).then(async () => {
                const stableToken = await props.app.kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    props.network.contracts.communityContract._address
                );
                // at least five cents
                setHasFundsToNewBeneficiary(
                    new BigNumber(cUSDBalanceBig.toString()).gte(
                        '50000000000000000'
                    )
                );
                setRefreshing(false);
            });
        }
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
            <Header title={i18n.t('manage')} navigation={navigation}>
                {community.status === 'valid' && (
                    <IconButton
                        icon="dots-horizontal"
                        style={{ backgroundColor: '#eaedf0' }}
                        onPress={() => setOpenModalMore(true)}
                    />
                )}
            </Header>
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
                                navigation.navigate('CreateCommunityScreen', {
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
                                navigation.navigate('CommunityDetailsScreen', {
                                    community,
                                });
                            }}
                        >
                            {i18n.t('viewAsPublic')}
                        </Button>
                        <Button
                            mode="outlined"
                            style={{ marginVertical: 10 }}
                            disabled
                        >
                            {i18n.t('share')}
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

export default connector(CommunityManagerView);
