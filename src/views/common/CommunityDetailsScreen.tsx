import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import CommuntyStatus from 'components/CommuntyStatus';
import Header from 'components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import {
    humanifyNumber,
    getCurrencySymbol,
} from 'helpers/index';
import {
    ICommunityInfo,
    IStoreCombinedActionsTypes,
    IStoreCombinedState,
} from 'helpers/types';
import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    RefreshControl,
} from 'react-native';
import { LineChart, ChartConfig } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph, Button, Card, Divider, Headline } from 'react-native-paper';

import config from '../../../config';
import Donate from '../communities/actions/Donate';
import Api from 'services/api';
import { useStore } from 'react-redux';

const lineChartConfig: ChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    strokeWidth: 2,
    barPercentage: 0.5,
    color: (opacity = 1) => `rgba(45,206,137,1)`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    style: {
        // borderRadius: 6
    },
    fillShadowGradientOpacity: 0,
};
interface ICommunityDetailsScreen {
    route: {
        params: {
            community: ICommunityInfo;
        };
    };
}
export default function CommunityDetailsScreen(props: ICommunityDetailsScreen) {
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const navigation = useNavigation();
    const rates = store.getState().app.exchangeRates;

    const [refreshing, setRefreshing] = useState(false);
    const [seeFullDescription, setSeeFullDescription] = useState(false);
    const [community, setCommunity] = useState<ICommunityInfo>(
        props.route.params.community
    );

    const onRefresh = () => {
        Api.getCommunityByContractAddress(community.contractAddress).then((c) =>
            setCommunity(c!)
        );
        setRefreshing(false);
    };

    const renderSSI = () => {
        if (community.ssi.values.length > 1) {
            const lineChartData = {
                labels: community.ssi.dates.map((date) => date.toString()),
                datasets: [{ data: community.ssi.values }],
            };
            return (
                <>
                    <Divider />
                    <View style={styles.chartView}>
                        <LineChart
                            data={lineChartData}
                            width={200}
                            height={100}
                            fromZero
                            chartConfig={lineChartConfig}
                            withInnerLines={false}
                            withOuterLines={false}
                            withHorizontalLabels={false}
                            withVerticalLabels={false}
                            withDots={false}
                            bezier
                            style={{
                                marginLeft: -70,
                            }}
                        />
                        <View style={styles.ssiView}>
                            <Headline style={styles.ssiHeadline}>
                                {
                                    community.ssi.values[
                                        community.ssi.values.length - 1
                                    ]
                                }
                                %
                            </Headline>
                            <Paragraph>{i18n.t('ssi')}</Paragraph>
                        </View>
                    </View>
                    <Paragraph style={styles.ssiExplained}>
                        {i18n.t('ssiDescription')}
                    </Paragraph>
                </>
            );
        }
    };

    let description;
    const cDescription =
        store.getState().user.user.language === community.language
            ? community.description
            : (community.descriptionEn === null ? community.description : community.descriptionEn);
    if (seeFullDescription || community.description.indexOf('\n') === -1) {
        description = cDescription;
    } else {
        description = cDescription.slice(
            0,
            cDescription.indexOf('\n')
        );
    }
    const amountInDollars = parseFloat(community.vars._claimAmount);
    const amountInCommunityCurrency =
        amountInDollars * rates[community.currency].rate;

    return (
        <>
            <Header title="" hasBack hasShare hasHelp navigation={navigation} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
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
                    <LinearGradient
                        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.15)', 'transparent']}
                        style={styles.darkerBackground}
                    />
                </ImageBackground>
                <View style={styles.container}>
                    <Card elevation={8}>
                        <Card.Content>
                            <Paragraph>{description}</Paragraph>
                            {community.description.indexOf('\n') !== -1 && (
                                <Button
                                    mode="contained"
                                    onPress={() =>
                                        setSeeFullDescription(
                                            !seeFullDescription
                                        )
                                    }
                                >
                                    {seeFullDescription
                                        ? i18n.t('seeLess')
                                        : i18n.t('seeMore')}
                                </Button>
                            )}
                        </Card.Content>
                    </Card>
                    <Card elevation={8} style={{ marginTop: 20 }}>
                        <Card.Content>
                            <Paragraph>
                                {i18n.t('eachBeneficiaryCanClaimXUpToY', {
                                    communityCurrency: getCurrencySymbol(
                                        community.currency
                                    ),
                                    claimXCCurrency: humanifyNumber(
                                        amountInCommunityCurrency.toString()
                                    ),
                                    claimX: humanifyNumber(
                                        community.vars._claimAmount
                                    ),
                                    upToY: humanifyNumber(
                                        community.vars._maxClaim
                                    ),
                                    minIncrement:
                                        parseInt(
                                            community.vars._incrementInterval
                                        ) / 60,
                                })}
                            </Paragraph>
                            {renderSSI()}
                        </Card.Content>
                    </Card>
                    <CommuntyStatus community={community}>
                        <Button
                            mode="outlined"
                            style={{ width: '100%' }}
                            onPress={() =>
                                WebBrowser.openBrowserAsync(
                                    config.blockExplorer +
                                        community.contractAddress +
                                        '/token_transfers'
                                )
                            }
                        >
                            {i18n.t('exploreCommunityContract')}
                        </Button>
                    </CommuntyStatus>
                </View>
            </ScrollView>
            <Donate community={community} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -40,
        margin: 20,
    },
    imageBackground: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    communityName: {
        zIndex: 5,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        zIndex: 5,
        fontSize: 20,
        color: 'white',
    },
    ssiExplained: {
        fontSize: 15,
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: 18,
        letterSpacing: 0.25,
        color: '#b0b0b0',
    },
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
    },
    darkerBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 180,
    },
    ssiHeadline: {
        fontFamily: 'Gelion-Regular',
        fontSize: 36,
        fontStyle: 'normal',
        lineHeight: 36,
        letterSpacing: 0,
        textAlign: 'right',
    },
    ssiView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 0,
    },
    chartView: {
        flex: 1,
        flexDirection: 'row',
        margin: 0,
    },
});
