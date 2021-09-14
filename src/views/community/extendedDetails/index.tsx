import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import Divider from 'components/Divider';
import Description from 'components/community/Description';
import AvatarPlaceholderSvg from 'components/svg/AvatarPlaceholderSvg';
import LocationsSvg from 'components/svg/LocationSvg';
import BackSvg from 'components/svg/header/BackSvg';
import { humanifyCurrencyAmount } from 'helpers/currency';
import { chooseMediaThumbnail } from 'helpers/index';
import { ManagerAttributes, UbiPromoter } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

function UBIParamsBox(props: { title: string; body: string }) {
    return (
        <View
            style={{
                padding: 16,
                borderRadius: 12,
                borderColor: ipctColors.softGray,
                borderWidth: 1,
                marginVertical: 4,
            }}
        >
            <Text
                style={{
                    fontSize: 14,
                    lineHeight: 24,
                    fontFamily: 'Inter-Regular',
                    color: ipctColors.lynch,
                }}
            >
                {props.title}
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    lineHeight: 22,
                    fontFamily: 'Inter-Bold',
                    color: ipctColors.darBlue,
                }}
            >
                {props.body}
            </Text>
        </View>
    );
}

function ManagersBox(props: { manager: ManagerAttributes }) {
    return (
        <View
            testID="manager-box"
            style={{
                padding: 16,
                borderRadius: 12,
                borderColor: ipctColors.softGray,
                borderWidth: 1,
                marginVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {props.manager.user && props.manager.user.avatar ? (
                <Image
                    source={{
                        uri: chooseMediaThumbnail(props.manager.user.avatar, {
                            heigth: 42,
                            width: 42,
                        }),
                    }}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        marginRight: 16,
                    }}
                />
            ) : (
                <AvatarPlaceholderSvg
                    width={42}
                    height={42}
                    style={{ marginRight: 16 }}
                />
            )}
            <View style={{ flexDirection: 'column' }}>
                <Text
                    style={{
                        fontSize: 13,
                        lineHeight: 22,
                        fontFamily: 'Inter-Bold',
                        color: ipctColors.darBlue,
                    }}
                >
                    {props.manager.user && props.manager.user.username
                        ? props.manager.user.username
                        : `${props.manager.address.slice(0, 12)}...`}
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        lineHeight: 20,
                        fontFamily: 'Inter-Regular',
                        color: ipctColors.lynch,
                    }}
                >
                    {i18n.t('manager.managerSince', {
                        date: moment(props.manager.createdAt).format(
                            'MMM DD, YYYY'
                        ),
                    })}
                </Text>
            </View>
        </View>
    );
}

function PromoterBox(props: { promoter: UbiPromoter | null; createdAt: Date }) {
    if (props.promoter === null) {
        return null;
    }
    return (
        <>
            <Text
                style={{
                    fontSize: 20,
                    lineHeight: 20,
                    fontFamily: 'Inter-Bold',
                    color: ipctColors.darBlue,
                    marginVertical: 16,
                }}
            >
                {i18n.t('promoter.promoter')}
            </Text>
            <View
                style={{
                    padding: 16,
                    borderRadius: 12,
                    borderColor: ipctColors.softGray,
                    borderWidth: 1,
                    marginVertical: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {props.promoter.logo ? (
                        <Image
                            source={{
                                uri: chooseMediaThumbnail(props.promoter.logo, {
                                    heigth: 42,
                                    width: 42,
                                }),
                            }}
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 21,
                                marginRight: 16,
                            }}
                        />
                    ) : (
                        <AvatarPlaceholderSvg
                            width={42}
                            height={42}
                            style={{ marginRight: 16 }}
                        />
                    )}
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 22,
                                fontFamily: 'Inter-Bold',
                                color: ipctColors.darBlue,
                            }}
                        >
                            {props.promoter.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                lineHeight: 20,
                                fontFamily: 'Inter-Regular',
                                color: ipctColors.lynch,
                            }}
                        >
                            {i18n.t('promoter.createdIn', {
                                date: moment(props.createdAt).format(
                                    'MMM DD, YYYY'
                                ),
                            })}
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        marginVertical: 10,
                        fontSize: 14,
                        lineHeight: 24,
                        fontFamily: 'Inter-Regular',
                        color: ipctColors.darBlue,
                    }}
                >
                    {props.promoter.description}
                </Text>
            </View>
        </>
    );
}

function CommunityExtendedDetailsScreen() {
    const community = useSelector(
        (state: IRootState) => state.communities.community
    );
    const [managers, setManagers] = useState<ManagerAttributes[]>([]);
    const [promoter, setPromoter] = useState<UbiPromoter | null>(null);

    useEffect(() => {
        const loadManagers = () =>
            Api.community.listManagers(community.id).then(setManagers);
        const getPromoter = () =>
            Api.community
                .getPromoter(community.id)
                .then((r) => setPromoter(r.data));
        if (community) {
            loadManagers();
            getPromoter();
        }
    }, [community]);

    return (
        <ScrollView
            style={{
                paddingHorizontal: 20,
            }}
            testID="communityExtendedDetails"
        >
            <View>
                <Text style={styles.communityName}>{community.name}</Text>
                <View style={styles.inlineBox}>
                    <LocationsSvg />
                    <Text style={styles.communityLocation}>
                        {community.city}, {countries[community.country].name}
                    </Text>
                </View>
            </View>
            <View style={styles.descriptionBox}>
                <Description community={community} />
            </View>
            <UBIParamsBox
                title={i18n.t('createCommunity.claimAmount')}
                body={`$${humanifyCurrencyAmount(
                    community.contract.claimAmount
                )} / ${
                    community.contract.baseInterval === 86400
                        ? i18n.t('generic.day')
                        : i18n.t('generic.week')
                }`}
            />
            <UBIParamsBox
                title={i18n.t('createCommunity.totalClaimPerBeneficiary')}
                body={`$${humanifyCurrencyAmount(community.contract.maxClaim)}`}
            />
            <UBIParamsBox
                title={i18n.t('createCommunity.incrementalFrequency')}
                body={`${community.contract.incrementInterval / 60} ${i18n.t(
                    'minutes'
                )}`}
            />
            <Divider />
            <Text
                style={{
                    fontSize: 20,
                    lineHeight: 20,
                    fontFamily: 'Inter-Bold',
                    color: ipctColors.darBlue,
                    marginBottom: 8,
                }}
            >
                {i18n.t('manager.managers')}
            </Text>
            {managers.map((manager) => (
                <ManagersBox key={manager.address} manager={manager} />
            ))}
            <PromoterBox promoter={promoter} createdAt={community.createdAt} />
        </ScrollView>
    );
}

CommunityExtendedDetailsScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: '',
    };
};

const styles = StyleSheet.create({
    communityName: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Manrope-Bold',
        color: ipctColors.darBlue,
    },
    communityLocation: {
        marginLeft: 4,
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
        color: ipctColors.lynch,
    },
    inlineBox: { flexDirection: 'row', alignItems: 'center' },

    descriptionBox: {
        marginTop: 16,
        marginBottom: 28,
    },
});

export default CommunityExtendedDetailsScreen;
