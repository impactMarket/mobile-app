import i18n from 'assets/i18n';
import BaseCommunity from 'components/BaseCommunity';
import CommuntyStatus from 'components/CommuntyStatus';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import BackSvg from 'components/svg/header/BackSvg';
import FaqSvg from 'components/svg/header/FaqSvg';
import * as shape from 'd3-shape';
import Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { modalDonateAction } from 'helpers/constants';
import { amountToCurrency, humanifyCurrencyAmount } from 'helpers/currency';
import { ICommunity } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { View, StyleSheet, RefreshControl, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    Paragraph,
    Divider,
    Headline,
    Text,
    ActivityIndicator,
    Snackbar,
} from 'react-native-paper';
import { LineChart } from 'react-native-svg-charts';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import config from '../../../../config';
import Donate from './donate';

interface ICommunityDetailsScreen {
    route: {
        params: {
            communityId: string;
            openDonate?: boolean;
            fromStories?: boolean;
        };
    };
}
export default function CommunityDetailsScreen(props: ICommunityDetailsScreen) {
    const dispatch = useDispatch();
    const rates = useSelector((state: IRootState) => state.app.exchangeRates);
    const language = useSelector(
        (state: IRootState) => state.user.metadata.language
    );

    const [refreshing, setRefreshing] = useState(false);
    const [seeFullDescription, setSeeFullDescription] = useState(false);
    const [historicalSSI, setHistoricalSSI] = useState<number[]>([]);
    const [community, setCommunity] = useState<ICommunity | undefined>(
        undefined
    );
    const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false);

    useEffect(() => {
        Api.community
            .getByPublicId(props.route.params.communityId)
            .then((c) => {
                setCommunity(c!);
                if (props.route.params.openDonate === true) {
                    dispatch({
                        type: modalDonateAction.OPEN,
                        payload: c,
                    });
                }
            })
            .finally(() => setRefreshing(false));
        Api.community
            .getHistoricalSSI(props.route.params.communityId)
            .then(setHistoricalSSI);
    }, []);

    const onRefresh = () => {
        Api.community
            .getByPublicId(props.route.params.communityId)
            .then((c) => setCommunity(c!))
            .finally(() => setRefreshing(false));
    };

    const renderSSI = () => {
        if (
            community !== undefined &&
            community.metrics !== undefined &&
            historicalSSI.length > 1
        ) {
            return (
                <>
                    <Divider
                        style={{
                            marginLeft: -16,
                            marginRight: -16,
                            marginTop: 16,
                        }}
                    />
                    <View style={styles.chartView}>
                        <LineChart
                            style={{ flex: 2, height: 100, width: 200 }}
                            data={historicalSSI.reverse()}
                            contentInset={{ top: 20, bottom: 20 }}
                            curve={shape.curveMonotoneX}
                            svg={{
                                strokeWidth: 4,
                                stroke: 'rgba(45,206,137,1)',
                            }}
                        />
                        <View
                            style={{
                                ...styles.ssiView,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Headline style={styles.ssiHeadline}>
                                    {community.metrics.ssi}
                                </Headline>
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontSize: 18,
                                        lineHeight: 18,
                                        padding: 3,
                                    }}
                                >
                                    %
                                </Text>
                            </View>
                            <Paragraph
                                style={{
                                    textAlign: 'right',
                                    fontSize: 14,
                                    lineHeight: 17,
                                }}
                            >
                                {i18n.t('ssi')}
                            </Paragraph>
                        </View>
                    </View>
                    <Paragraph style={styles.ssiExplained}>
                        {i18n.t('ssiDescription')}
                    </Paragraph>
                </>
            );
        }
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

    const handleCopyToClipboard = () => {
        Clipboard.setString(community.contractAddress!);
        setShowCopiedToClipboard(true);
    };

    let description;
    const cDescription =
        language === community.language
            ? community.description
            : community.descriptionEn === null
            ? community.description
            : community.descriptionEn;
    if (seeFullDescription || community.description.indexOf('\n') === -1) {
        description = cDescription;
    } else {
        description = cDescription.slice(0, cDescription.indexOf('\n'));
    }

    return (
        <>
            <StatusBar hidden={false} />
            <Snackbar
                visible={showCopiedToClipboard}
                onDismiss={() => setShowCopiedToClipboard(false)}
                action={{
                    label: i18n.t('close'),
                    onPress: () => setShowCopiedToClipboard(false),
                }}
            >
                {i18n.t('descriptionCopiedClipboard')}
            </Snackbar>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <BaseCommunity community={community}>
                    <View style={styles.container}>
                        <Card elevation={0}>
                            <Card.Content>
                                <Paragraph
                                    style={{
                                        fontSize: 17,
                                        lineHeight: 22,
                                    }}
                                    onPress={handleCopyToClipboard}
                                >
                                    {description}
                                </Paragraph>
                                {community.description.indexOf('\n') !== -1 && (
                                    <View style={{ paddingTop: 16 }}>
                                        <Button
                                            modeType="gray"
                                            bold
                                            style={{
                                                backgroundColor:
                                                    'rgba(206, 212, 218, .27)',
                                            }}
                                            labelStyle={{
                                                fontSize: 15,
                                                lineHeight: 18,
                                            }}
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
                                    </View>
                                )}
                            </Card.Content>
                        </Card>
                        <Card elevation={0} style={{ marginTop: 16 }}>
                            <Card.Content>
                                <Paragraph
                                    style={{
                                        fontSize: 17,
                                        lineHeight: 21,
                                    }}
                                >
                                    <Trans
                                        i18nKey="eachBeneficiaryCanClaimXUpToY"
                                        values={{
                                            claimXCCurrency: amountToCurrency(
                                                community.contract.claimAmount,
                                                community.currency,
                                                rates
                                            ),
                                            claimX: humanifyCurrencyAmount(
                                                community.contract.claimAmount
                                            ),
                                            upToY: humanifyCurrencyAmount(
                                                community.contract.maxClaim
                                            ),
                                            interval:
                                                community.contract
                                                    .baseInterval === 86400
                                                    ? i18n.t('day')
                                                    : i18n.t('week'),
                                            minIncrement:
                                                community.contract
                                                    .incrementInterval / 60,
                                        }}
                                        components={{
                                            bold: (
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            'Gelion-Bold',
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                </Paragraph>
                                {renderSSI()}
                            </Card.Content>
                        </Card>
                        <CommuntyStatus community={community}>
                            <Button
                                modeType="gray"
                                bold
                                style={{ marginTop: '5%' }}
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
                </BaseCommunity>
            </ScrollView>
            <Donate community={community} />
        </>
    );
}

CommunityDetailsScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerRight: () => <FaqSvg style={{ marginRight: 16 }} />,
        headerTitle: '',
    };
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 30,
    },
    imageBackground: {
        width: '100%',
        height: 152,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 25,
    },
    darkerBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 152,
    },
    communityName: {
        zIndex: 5,
        marginTop: 22,
        marginBottom: 2,
        fontSize: 30,
        lineHeight: 36,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        zIndex: 5,
        marginBottom: 32.41,
        fontSize: 15,
        lineHeight: 15,
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center',
    },
    ssiExplained: {
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: 0.245455,
        color: ipctColors.regentGray,
    },
    ssiHeadline: {
        fontFamily: 'Gelion-Bold',
        fontSize: 36,
        lineHeight: 36,
        textAlign: 'right',
    },
    ssiView: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 0,
    },
    chartView: {
        flex: 3,
        flexDirection: 'row',
        margin: 0,
    },
});
