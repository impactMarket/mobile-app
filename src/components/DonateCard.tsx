import i18n from 'assets/i18n';
import { modalDonateAction } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Title, Text } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import { WebView } from 'react-native-webview';
import { useDispatch, Provider, useStore } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import ConfirmModal from '../views/community/details/donate/modals/confirm';
import DonateModal from '../views/community/details/donate/modals/donate';
import ErrorModal from '../views/community/details/donate/modals/error';
import renderHeader from './core/HeaderBottomSheetTitle';

interface IDonateProps {
    community: CommunityAttributes;
}

export default function DonateCard(props: IDonateProps) {
    const { width } = Dimensions.get('screen');
    const { community } = props;
    const dispatch = useDispatch();
    //TODO: Create a page to be shown when the community isnt's fundraising on eSolidar.
    const [campaignUrl, setCampaignUrl] = useState<string>(
        'https://community.esolidar.com/pt'
    );
    const modalizeESolidar = useRef<Modalize>(null);

    useEffect(() => {
        Api.community
            .getCommunityFundraisingUrl(community.id)
            .then((res) => {
                res?.campaignUrl && setCampaignUrl(res.campaignUrl);
            })
            .catch((e) => {
                console.log(e);
            });
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
                    onPress={() =>
                        dispatch({
                            type: modalDonateAction.OPEN,
                            payload: community,
                        })
                    }
                    testID="donateWithCelo"
                >
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: width < 375 ? 11 : 16,
                                lineHeight: width < 375 ? 22 : 28,
                                color: 'white',
                                marginRight: 10,
                            }}
                        >
                            {i18n.t('donate.donateWithCelo')}
                        </Text>
                        <Image
                            source={require('assets/images/celoDolar.png')}
                            width={22}
                            height={22}
                        />
                    </View>
                </Pressable>
                <Text
                    style={[
                        styles.description,
                        { fontSize: width < 375 ? 11 : 16 },
                    ]}
                >
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
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontWeight: '500',
                                fontSize: width < 375 ? 11 : 16,
                                lineHeight: width < 375 ? 22 : 28,
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
                    }}
                >
                    <Text
                        style={[
                            styles.description,
                            {
                                color: ipctColors.regentGray,
                                fontSize: width < 375 ? 11 : 14,
                                marginRight: 4,
                            },
                        ]}
                    >
                        {i18n.t('donate.poweredByESolidar')}
                    </Text>
                    <Image source={require('assets/images/eSolidar.png')} />
                </View>
            </View>
            <Portal>
                <Provider store={useStore()}>
                    <DonateModal />
                    <ConfirmModal />
                    <ErrorModal />
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
                </Provider>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Inter-Bold',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 32,
        marginBottom: 8,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
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
