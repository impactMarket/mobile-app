// import { Heading } from '@impact-market/ui-kit';
import i18n from 'assets/i18n';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import CeloDolarSvg from 'components/svg/CeloDolarSvg';
import EsolidarSvg from 'components/svg/EsolidarSvg';
// import { modalDonateAction } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Title, Text } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import { WebView } from 'react-native-webview';
// import { useDispatch, Provider, useStore } from 'react-redux';
import Api from 'services/api';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

import DonateView from './donate';

// import ConfirmModal from '../views/community/details/donate/modals/confirm';
// import DonateModal from '../views/community/details/donate/modals/donate';
// import ErrorModal from '../views/community/details/donate/modals/error';
// import renderHeader from './core/HeaderBottomSheetTitle';
// import CeloDolarSvg from './svg/CeloDolarSvg';
// import EsolidarSvg from './svg/EsolidarSvg';

interface IDonateProps {
    community: CommunityAttributes;
}

export default function DonateCard(props: IDonateProps) {
    const { width } = Dimensions.get('screen');
    const { community } = props;
    // const dispatch = useDispatch();
    const [campaignUrl, setCampaignUrl] = useState<string | null>(null);
    const modalizeESolidar = useRef<Modalize>(null);
    const modalDonateRef = useRef<Modalize>(null);

    useEffect(() => {
        Api.community
            .getCampaign(community.id)
            .then((res) =>
                setCampaignUrl(res === null ? null : res.campaignUrl)
            );
    }, [community]);

    return (
        <>
            <View style={styles.donateContainer}>
                <Title
                    style={[styles.title, { fontSize: width < 375 ? 14 : 20 }]}
                >
                    {i18n.t('donate.contributeWith')}
                </Title>
                <Pressable
                    style={styles.button}
                    onPress={() => modalDonateRef.current?.open()}
                    testID="donateWithCelo"
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: ipctFontSize.small,
                                lineHeight: ipctLineHeight.large,
                                color: 'white',
                                marginRight: 10,
                            }}
                        >
                            {i18n.t('donate.donateWithCelo')}
                        </Text>
                        <CeloDolarSvg />
                    </View>
                </Pressable>
                {campaignUrl !== null && (
                    <>
                        <Text style={[styles.description]}>
                            {i18n.t('generic.or')}
                        </Text>
                        <Pressable
                            style={[
                                styles.button,
                                {
                                    backgroundColor: 'transparent',
                                    borderColor: ipctColors.borderGray,
                                    borderWidth: 1,
                                },
                            ]}
                            onPress={() => modalizeESolidar.current?.open()}
                            testID="donateWithESolidar"
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    padding: 4,
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: 'Inter-Regular',
                                        fontWeight: '500',
                                        fontSize: ipctFontSize.small,
                                        lineHeight: ipctLineHeight.large,
                                        color: ipctColors.blueRibbon,
                                    }}
                                >
                                    {i18n.t('donate.donateWithESolidar')}
                                </Text>
                            </View>
                        </Pressable>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                            }}
                        >
                            <Text
                                style={[
                                    styles.description,
                                    {
                                        color: ipctColors.regentGray,
                                        marginRight: 4,
                                    },
                                ]}
                            >
                                {i18n.t('donate.poweredByESolidar')}
                            </Text>
                            <EsolidarSvg />
                        </View>
                    </>
                )}
            </View>
            <Portal>
                <Modalize
                    ref={modalDonateRef}
                    HeaderComponent={renderHeader(
                        'Donate',
                        modalDonateRef,
                        () => {},
                        false
                    )}
                    adjustToContentHeight
                    onClose={() => {}}
                >
                    <DonateView
                        modalDonateRef={modalDonateRef}
                        communityContract={community.contractAddress}
                    />
                </Modalize>
                <Modalize
                    ref={modalizeESolidar}
                    HeaderComponent={renderHeader(
                        null,
                        modalizeESolidar,
                        () => {},
                        true
                    )}
                    adjustToContentHeight
                >
                    <WebView
                        originWhitelist={['*']}
                        source={{
                            uri: campaignUrl,
                        }}
                        style={{
                            height: Dimensions.get('screen').height * 0.85,
                        }}
                        testID="webViewESolidar"
                    />
                </Modalize>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Inter-Bold',
        fontWeight: '700',
        fontSize: ipctFontSize.regular,
        lineHeight: ipctLineHeight.xlarge,
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: ipctFontSize.smaller,
        lineHeight: ipctLineHeight.bigger,
        fontStyle: 'normal',
        fontWeight: '400',
        letterSpacing: 0,
        marginVertical: 8,
    },
    donateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
    },
    button: {
        height: 44,
        width: '100%',
        borderRadius: 6,
        backgroundColor: ipctColors.blueRibbon,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
