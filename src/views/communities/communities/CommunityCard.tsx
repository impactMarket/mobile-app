import { Label, Image, colors } from '@impact-market/ui-kit';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import Dot from 'components/Dot';
import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import ShimmerText from 'components/shimmers/Text';
import IconCommunity from 'components/svg/IconCommunity';
import LocationsSvg from 'components/svg/LocationSvg';
import { Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { chooseMediaThumbnail } from 'helpers/index';
import { CommunityAttributes } from 'helpers/types/models';
import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
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
function CommunityCard(props: {
    community: CommunityAttributes;
    rates: {
        [key: string]: number;
    };
    userCurrency: string;
    navigation: NavigationProp<ParamListBase, string, Readonly<any>, any, any>;
}) {
    const { community, rates, userCurrency, navigation } = props;
    const [loadedImage, setLoadedImage] = useState(false);

    if (community.name === undefined) {
        return (
            <View style={styles.card}>
                <ShimmerPlaceholder
                    delay={0}
                    duration={1000}
                    isInteraction
                    height={254}
                    width={254}
                    shimmerContainerProps={{
                        width: '100%',
                        borderRadius: 8,
                        // marginVertical: 22,
                    }}
                    shimmerStyle={{ borderRadius: 8 }}
                    visible={false}
                />
                <ShimmerText width={254} isShort />
            </View>
        );
    }

    const claimAmount = amountToCurrency(
        community.contract.claimAmount,
        userCurrency,
        rates
    );
    const claimFrequency =
        community.contract.baseInterval === 86400 ||
        community.contract.baseInterval === 17280
            ? i18n.t('generic.days', { count: 1 })
            : i18n.t('generic.week');

    const coverSource = {
        uri: chooseMediaThumbnail(community.cover, {
            heigth: 330,
            width: 330,
        }),
    };

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
                    <ShimmerPlaceholder
                        delay={0}
                        duration={1000}
                        isInteraction
                        height={254}
                        width={254}
                        shimmerContainerProps={{
                            width: '100%',
                            borderRadius: 8,
                        }}
                        shimmerStyle={{ borderRadius: 8 }}
                        visible={loadedImage}
                    >
                        <Image
                            style={styles.cardImage}
                            source={coverSource}
                            onLoadEnd={() => setLoadedImage(true)}
                        />
                        <View style={styles.nuxContainer}>
                            <Label star={colors.brand.white}>Featured</Label>
                        </View>
                        <View style={styles.darkerBackground} />
                    </ShimmerPlaceholder>
                </View>
                <View
                    style={{
                        marginTop: 16,
                        height: 144,
                        width: 254,
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={styles.cardCommunityName}>
                        {community.name}
                    </Text>
                    <Text style={styles.cardCommunityDescription}>
                        {community.description?.length > 90
                            ? community.description.substr(0, 90) + '...'
                            : community.description}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // bottom: 0,
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <IconCommunity style={{ marginRight: 4 }} />
                            <Text style={styles.bottomCardText}>
                                {community.state.beneficiaries}
                            </Text>
                        </View>
                        <Dot />
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                marginRight: 4,
                            }}
                        >
                            <Text style={styles.bottomCardText}>
                                {claimAmount}/{claimFrequency}
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
    nuxContainer: {
        position: 'absolute',
        marginTop: 21,
        marginLeft: 20,
        zIndex: 1,
    },
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
        height: 254,
    },
    cardCommunityTagText: {
        marginLeft: 4,
        fontSize: ipctFontSize.tiny,
        lineHeight: ipctLineHeight.small,
        fontFamily: 'Inter-Regular',
        color: ipctColors.nileBlue,
        textAlign: 'left',
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
    card: {
        marginHorizontal: 8,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        maxWidth: 254,
        paddingBottom: 21,
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
