import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Header from 'components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { iptcColors, humanifyNumber } from 'helpers/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Alert,
    RefreshControl,
} from 'react-native';
import { Button, ProgressBar, Snackbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';
import * as Location from 'expo-location';

import Claim from './Claim';
import { ScrollView } from 'react-native-gesture-handler';

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function BeneficiaryView(props: Props) {
    const navigation = useNavigation();
    const [community, setCommunity] = useState<ICommunityInfo>();
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [claimedProgress, setClaimedProgress] = useState(0.1);
    const [refreshing, setRefreshing] = useState(false);
    const [askLocationOnOpen, setAskLocationOnOpen] = useState(true);

    useEffect(() => {
        const loadCommunity = async () => {
            if (
                props.network.contracts.communityContract !== undefined &&
                props.user.celoInfo.address.length > 0
            ) {
                const { _address } = props.network.contracts.communityContract;
                const _community = await Api.getCommunityByContractAddress(
                    _address
                );
                if (_community === undefined) {
                    Alert.alert(
                        i18n.t('failure'),
                        i18n.t('errorWhileLoadingRestart'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                } else {
                    const amount = await props.network.contracts.communityContract.methods
                        .claimed(props.user.celoInfo.address)
                        .call();
                    const progress = new BigNumber(amount.toString()).div(
                        _community.vars._maxClaim
                    );
                    setClaimedAmount(humanifyNumber(amount.toString()));
                    setClaimedProgress(progress.toNumber());
                    setCommunity(_community);
                }
            }
        };
        const isLocationAvailable = async () => {
            const availableGPSToRequest =
                (await Location.hasServicesEnabledAsync()) &&
                (await Location.getPermissionsAsync()).status === 'granted' &&
                (await Location.getProviderStatusAsync())
                    .locationServicesEnabled;
            setAskLocationOnOpen(!availableGPSToRequest);
        };
        loadCommunity();
        isLocationAvailable();
    }, [
        props.network.contracts.communityContract,
        props.user.celoInfo.address,
    ]);

    const onRefresh = () => {
        Api.getCommunityByContractAddress(
            community!.contractAddress
        ).then((c) => setCommunity(c!));
        setRefreshing(false);
    };

    const updateClaimedAmount = async () => {
        const amount = await props.network.contracts.communityContract.methods
            .claimed(props.user.celoInfo.address)
            .call();

        setClaimedAmount(humanifyNumber(amount.toString()));
    };

    if (community === undefined) {
        return <Text>{i18n.t('loading')}</Text>;
    }

    return (
        <>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Header
                    title={i18n.t('claim')}
                    navigation={navigation}
                    hasHelp
                    hasQr
                />
                <ImageBackground
                    source={{ uri: community.coverImage }}
                    resizeMode="cover"
                    style={styles.imageBackground}
                >
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.communityLocation}>
                        <AntDesign name="enviromento" size={20} />{' '}
                        {community.city}, {community.country}
                    </Text>
                    <LinearGradient
                        colors={['transparent', 'rgba(246,246,246,1)']}
                        style={styles.linearGradient}
                    />
                    <Button
                        mode="outlined"
                        style={{ margin: 30 }}
                        onPress={() =>
                            navigation.navigate('CommunityDetailsScreen', {
                                community,
                                user: props.user,
                            })
                        }
                    >
                        {i18n.t('moreAboutYourCommunity')}
                    </Button>
                </ImageBackground>
                <View style={styles.contentView}>
                    <View style={{ marginTop: '8%' }}>
                        <Text
                            onPress={() =>
                                navigation.navigate('ClaimExplainedScreen')
                            }
                            style={styles.haveClaimed}
                        >
                            {i18n.t('youHaveClaimedXoutOfY', {
                                claimed: claimedAmount,
                                max: humanifyNumber(community.vars._maxClaim),
                            })}
                        </Text>
                        <ProgressBar
                            key="claimedbybeneficiary"
                            style={styles.claimedProgress}
                            progress={claimedProgress}
                            color="#5289ff"
                        />
                    </View>
                    <Claim
                        claimAmount={community.vars._claimAmount}
                        updateClaimedAmount={updateClaimedAmount}
                    />
                    <View style={{ marginTop: '3%' }}>
                        <Text>
                            {i18n.t('nextTimeWillWaitClaim', {
                                nextWait: `${
                                    parseInt(community.vars._baseInterval) /
                                    60 /
                                    60
                                }h${
                                    parseInt(
                                        community.vars._incrementInterval
                                    ) / 60
                                }m`,
                            })}
                        </Text>
                        <Text
                            onPress={() =>
                                navigation.navigate('ClaimExplainedScreen')
                            }
                            style={styles.howClaimsWork}
                        >
                            {i18n.t('knowHowClaimWorks')}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <Snackbar
                visible={askLocationOnOpen}
                duration={10000}
                onDismiss={() => setAskLocationOnOpen(false)}
                action={{
                    label: i18n.t('turnOn'),
                    onPress: async () => {
                        try {
                            await Location.requestPermissionsAsync();
                            await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.Low,
                            });
                        } catch (e) {
                            Alert.alert(
                                i18n.t('failure'),
                                i18n.t('errorGettingGPSLocation'),
                                [
                                    {
                                        text: i18n.t('tryAgain'),
                                        onPress: async () => {
                                            await Location.requestPermissionsAsync();
                                            await Location.getCurrentPositionAsync(
                                                {
                                                    accuracy:
                                                        Location.Accuracy.Low,
                                                }
                                            );
                                        },
                                    },
                                    {
                                        text: i18n.t('cancel'),
                                    },
                                ],
                                { cancelable: false }
                            );
                        }
                    },
                }}
            >
                {i18n.t('turnOnLocationHint')}
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     flexDirection: 'column',
    //     justifyContent: 'space-between',
    // },
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    claimedProgress: {
        backgroundColor: '#d6d6d6',
        marginHorizontal: 30,
        marginVertical: 13,
    },
    imageBackground: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        fontSize: 20,
        color: 'white',
    },
    howClaimsWork: {
        fontFamily: 'Gelion-Bold',
        fontSize: 18,
        fontWeight: '500',
        fontStyle: 'normal',
        letterSpacing: 0.3,
        textAlign: 'center',
        color: iptcColors.softBlue,
        height: 25,
    },
    haveClaimed: {
        fontFamily: 'Gelion-Regular',
        fontSize: 15,
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: 14,
        letterSpacing: 0.25,
        textAlign: 'center',
        color: '#7e8da6',
    },
});

export default connector(BeneficiaryView);
