import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import CachedImage from 'components/CacheImage';
import Card from 'components/core/Card';
import { Screens } from 'helpers/constants';
import { humanifyCurrencyAmount } from 'helpers/currency';
import {
    calculateCommunityProgress,
    claimFrequencyToText,
    generateUrlWithCloudFront,
} from 'helpers/index';
import { ICommunityLightDetails } from 'helpers/types/endpoints';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { ipctColors } from 'styles/index';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        phone: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;
function CommunityCard(props: { community: ICommunityLightDetails }) {
    const navigation = useNavigation();
    const { community } = props;

    return (
        <Card
            key={community.name}
            // elevation={8}
            style={styles.card}
            onPress={() =>
                navigation.navigate(Screens.CommunityDetails, {
                    communityId: community.publicId,
                })
            }
        >
            <Card.Content style={{ margin: -16 }}>
                <View style={{ position: 'relative' }}>
                    <CachedImage
                        style={styles.cardImage}
                        source={{
                            uri: generateUrlWithCloudFront(
                                community.coverImage
                            ),
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 5,
                            ...styles.cardImage,
                        }}
                    >
                        <Text style={styles.cardCommunityName}>
                            {community.name}
                        </Text>
                        <Text style={styles.cardLocation}>
                            <Entypo name="location-pin" size={15} />{' '}
                            {community.city},{' '}
                            {countries[community.country].name}
                        </Text>
                    </View>
                    <View style={styles.darkerBackground} />
                </View>
                <View style={{ marginHorizontal: 17, marginBottom: 16.24 }}>
                    <View
                        style={{
                            flex: 3,
                            flexDirection: 'row',
                            marginTop: 19.27,
                            marginBottom: 17.85,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cellHeader}>
                                {community.state.beneficiaries}
                            </Text>
                            <Text style={styles.cellDescription}>
                                {i18n.t('beneficiaries')}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cellHeader}>
                                $
                                {humanifyCurrencyAmount(
                                    community.contract.claimAmount
                                )}
                            </Text>
                            <Text style={styles.cellDescription}>
                                {claimFrequencyToText(
                                    community.contract.baseInterval
                                )}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cellHeader}>
                                {community.state.backers}
                            </Text>
                            <Text style={styles.cellDescription}>
                                {i18n.t('backers')}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <ProgressBar
                            key="raised"
                            style={{
                                backgroundColor: ipctColors.softGray,
                                position: 'absolute',
                                borderRadius: 6.5,
                                height: 6.32,
                            }}
                            progress={calculateCommunityProgress(
                                'raised',
                                community
                            )}
                            color={ipctColors.blueRibbon}
                        />
                        <ProgressBar
                            key="claimed"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0)',
                                borderRadius: 6.5,
                                height: 6.32,
                            }}
                            progress={calculateCommunityProgress(
                                'claimed',
                                community
                            )}
                            color={ipctColors.greenishTeal}
                        />
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    cardImage: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width: '100%',
        height: 147,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    darkerBackground: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.15)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 147,
    },
    cardCommunityName: {
        zIndex: 5,
        marginHorizontal: 15,
        fontSize: 28,
        lineHeight: 34,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    cardLocation: {
        zIndex: 5,
        fontFamily: 'Gelion-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
    },
    cardInfo: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    card: {
        marginHorizontal: 16,
        minWidth: 303,
        marginBottom: 22,
        // marginTop: 8,
        padding: 0,
    },
    cellHeader: {
        fontFamily: 'Gelion-Bold',
        fontSize: 24,
        lineHeight: 24,
        textAlign: 'center',
        color: ipctColors.nileBlue,
    },
    cellDescription: {
        fontFamily: 'Gelion-Regular',
        fontSize: 14,
        lineHeight: 16,
        opacity: 0.7,
        textAlign: 'center',
        color: ipctColors.nileBlue,
        marginTop: 6,
    },
});

export default React.memo(CommunityCard);
