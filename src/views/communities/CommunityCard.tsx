import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import CachedImage from 'components/CacheImage';
import BeneficiariesSvg from 'components/svg/BeneficiariesSvg';
import LocationsSvg from 'components/svg/LocationSvg';
import { Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;
function CommunityCard(props: { community: CommunityAttributes }) {
    const navigation = useNavigation();
    const { community } = props;

    const rates = useSelector((state: IRootState) => state.app.exchangeRates);

    if (community.state === undefined || community.contract === undefined) {
        navigation.goBack();
        // TODO: throw some error!
        return null;
    }

    // const setTextSuspects = (suspects: number) => {
    //     switch (true) {
    //         case suspects < 1:
    //             return i18n.t('noSuspiciousActivity');

    //         case suspects < 4:
    //             return i18n.t('lowSuspiciousActivity');

    //         case suspects < 8:
    //             return i18n.t('significantSuspiciousActivity');

    //         case suspects > 7:
    //             return i18n.t('largeSuspiciousActivity');

    //         default:
    //             return i18n.t('noSuspiciousActivity');
    //     }
    // };

    return (
        <Pressable
            onPress={() =>
                navigation.navigate(Screens.CommunityDetails, {
                    communityId: community.id,
                })
            }
        >
            <View key={community.name} style={styles.card}>
                <View style={{ position: 'relative' }}>
                    <CachedImage
                        style={styles.cardImage}
                        source={{
                            uri: community?.cover?.url,
                        }}
                    />
                    {/* TODO: add run out of funds detection algorithm to decide whether show warning or not.  */}
                    {/* <View
                        style={{
                            position: 'absolute',
                            zIndex: 5,
                            backgroundColor: ipctColors.white,
                            left: 20,
                            bottom: 64,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 8,
                            padding: 8,
                        }}
                    >
                        <WarningTriangle color={ipctColors.warningOrange} />
                        <Text style={styles.cardCommunityTagText}>
                            {i18n.t('funds')}
                        </Text>
                    </View> */}

                    {/* TODO: add suspect level algorithm.  */}
                    {/* {!community.suspect && (
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: 5,
                                backgroundColor: ipctColors.white,
                                left: 20,
                                bottom: 18,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 8,
                                padding: 8,
                            }}
                        >
                            <SuspiciousActivityMiddleSvg />
                            <Text style={styles.cardCommunityTagText}>
                                {setTextSuspects(Number(community.suspect))}
                            </Text>
                        </View>
                    )} */}
                    <View style={styles.darkerBackground} />
                </View>
                <View
                    style={{
                        marginVertical: 16,
                        height: 210,
                        width: 254,
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={styles.cardCommunityName}>
                        {community.name}
                    </Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardCommunityDescription}>
                            {community.description?.length > 100
                                ? community.description.substr(0, 100) + '...'
                                : community.description}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            bottom: 0,
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <BeneficiariesSvg style={{ marginRight: 4 }} />
                            <Text style={styles.bottomCardText}>
                                {community.state.beneficiaries}
                            </Text>
                        </View>
                        <Text style={styles.interPunct}>{'\u2B24'}</Text>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                marginRight: 4,
                            }}
                        >
                            <Text style={styles.bottomCardText}>
                                ~
                                {amountToCurrency(
                                    community.contract.claimAmount,
                                    community.currency,
                                    rates
                                )}
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                marginRight: 12,
                            }}
                        >
                            <LocationsSvg style={{ marginRight: 4 }} />
                            <Text style={styles.bottomCardText}>
                                {countries[community.country].name}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardImage: {
        borderRadius: 8,
        width: 254,
        height: 254,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    darkerBackground: {
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.15)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 147,
    },
    cardCommunityTagText: {
        marginLeft: 4,
        fontSize: ipctFontSize.tiny,
        lineHeight: ipctLineHeight.small,
        fontFamily: 'Inter-Regular',
        color: ipctColors.nileBlue,
        textAlign: 'left',
    },
    interPunct: {
        fontSize: 2.5,
        marginHorizontal: 4,
        color: ipctColors.blueGray,
    },
    cardCommunityName: {
        fontSize: ipctFontSize.small,
        lineHeight: ipctLineHeight.big,
        fontFamily: 'Manrope-Bold',
        fontWeight: '800',
        color: ipctColors.almostBlack,
        textAlign: 'left',
    },
    cardCommunityDescription: {
        //TODO: Create a font size 15
        fontSize: ipctFontSize.smaller,
        lineHeight: ipctLineHeight.bigger,
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: ipctColors.darBlue,
        textAlign: 'left',
        marginVertical: 8,
    },
    cardLocation: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: ipctFontSize.xsmall,
        lineHeight: ipctLineHeight.medium,
        color: ipctColors.blueGray,
    },
    cardInfo: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    card: {
        marginHorizontal: 8,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        maxWidth: 254,
        marginBottom: 11,
    },
    bottomCardText: {
        fontFamily: 'Inter-Regular',
        fontSize: ipctFontSize.xsmall,
        lineHeight: ipctLineHeight.medium,
        textAlign: 'center',
        color: ipctColors.blueGray,
    },
    cellDescription: {
        fontFamily: 'Gelion-Regular',
        fontSize: ipctFontSize.smaller,
        lineHeight: ipctLineHeight.smaller,
        opacity: 0.7,
        textAlign: 'center',
        color: ipctColors.nileBlue,
        marginTop: 6,
    },
});

export default React.memo(CommunityCard);
