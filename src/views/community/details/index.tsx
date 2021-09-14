import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import CommunityStatus from 'components/CommunityStatus';
import DonateCard from 'components/DonateCard';
import Dot from 'components/Dot';
import SuspiciousCard from 'components/SuspiciousCard';
import Description from 'components/community/Description';
import IconCommunity from 'components/svg/IconCommunity';
import LocationsSvg from 'components/svg/LocationSvg';
import BackSvg from 'components/svg/header/BackSvg';
import FaqSvg from 'components/svg/header/FaqSvg';
import ShareSvg from 'components/svg/header/ShareSvg';
import { modalDonateAction } from 'helpers/constants';
import { chooseMediaThumbnail } from 'helpers/index';
import {
    cleanCommunityState,
    findCommunityByIdRequest,
} from 'helpers/redux/actions/communities';
import { UbiPromoter } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    RefreshControl,
    StatusBar,
    Image,
    Text,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

interface ICommunityDetailsScreen {
    route: {
        params: {
            communityId: number;
            openDonate?: boolean;
            fromStories?: boolean;
        };
    };
}
const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;
export default function CommunityDetailsScreen(props: ICommunityDetailsScreen) {
    const dispatch = useDispatch();

    const community = useSelector(
        (state: IRootState) => state.communities.community
    );

    const [refreshing, setRefreshing] = useState(false);
    const [showCopiedToClipboard, setShowCopiedToClipboard] = useState(false);
    const [promoter, setPromoter] = useState<UbiPromoter | null>(null);

    useEffect(() => {
        dispatch(findCommunityByIdRequest(props.route.params.communityId));
        return () => dispatch(cleanCommunityState());
    }, [dispatch, props.route.params.communityId]);

    useEffect(() => {
        const checkDonateOpen = () => {
            if (props.route.params.openDonate === true) {
                dispatch({
                    type: modalDonateAction.OPEN,
                    payload: community,
                });
            }
        };
        if (community) {
            checkDonateOpen();
        }
    }, [community, props.route.params]);

    useEffect(() => {
        const getPromoter = () =>
            Api.community
                .getPromoter(community.id)
                .then((r) => setPromoter(r.data));
        if (community !== undefined && community !== null) {
            getPromoter();
        }
    }, [community]);

    const onRefresh = () => {
        dispatch(findCommunityByIdRequest(props.route.params.communityId));
        setRefreshing(false);
    };

    if (
        community === undefined ||
        community?.contract === undefined ||
        community?.state === undefined
    ) {
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

    const SponsoredBy = () => {
        if (promoter === null) {
            return null;
        }
        return (
            <View style={styles.inlineBox}>
                <Text style={styles.textManagers}>
                    {i18n.t('promoter.promotedBy')}
                </Text>
                <Text style={styles.textBeneficiaries}>{promoter.name}</Text>
            </View>
        );
    };

    return (
        <>
            <StatusBar hidden={false} />
            <Snackbar
                visible={showCopiedToClipboard}
                onDismiss={() => setShowCopiedToClipboard(false)}
                action={{
                    label: i18n.t('generic.close'),
                    onPress: () => setShowCopiedToClipboard(false),
                }}
            >
                {i18n.t('generic.descriptionCopiedClipboard')}
            </Snackbar>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{
                    paddingHorizontal: 20,
                }}
            >
                <View>
                    <Text style={styles.communityName}>{community.name}</Text>
                    <View style={styles.inlineBox}>
                        <LocationsSvg />
                        <Text style={styles.communityLocation}>
                            {community.city},{' '}
                            {countries[community.country].name}
                        </Text>
                    </View>
                </View>
                <View>
                    <Image
                        style={styles.cover}
                        source={{
                            uri: chooseMediaThumbnail(community.cover!, {
                                width: 330,
                                heigth: 330,
                            }),
                        }}
                    />
                    <View style={styles.darkerBackground} />
                </View>
                <View style={styles.inlineBox}>
                    <IconCommunity />
                    <Text style={styles.textBeneficiaries}>
                        {community.state!.beneficiaries}{' '}
                        {i18n.t('generic.beneficiaries').toLowerCase()}
                    </Text>
                    <Dot />
                    <Text style={styles.textManagers}>
                        {community.state!.managers}{' '}
                        {i18n.t('manager.managers').toLowerCase()}
                    </Text>
                </View>
                <SponsoredBy />
                <Description community={community} isShort />
                <View
                    style={{
                        borderRadius: 12,
                        borderColor: ipctColors.softGray,
                        borderWidth: 1,
                        marginVertical: 16,
                    }}
                >
                    {community.suspect !== undefined &&
                        community.suspect !== null && (
                            <SuspiciousCard
                                suspectCounts={community.suspect.suspect}
                            />
                        )}
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <CommunityStatus community={community} />
                        <View style={styles.divider} />
                        <DonateCard community={community} />
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

CommunityDetailsScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerRight: () => (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginRight: 16,
                }}
            >
                <FaqSvg />
                <ShareSvg />
            </View>
        ),
        headerTitle: '',
    };
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: ipctColors.softGray,
    },
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
    cover: {
        width: '100%',
        height: 329,
        borderRadius: 20,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
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
    textBeneficiaries: {
        fontFamily: 'Inter-Bold',
        marginLeft: 4,
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.darBlue,
    },
    textManagers: {
        fontFamily: 'Inter-Regular',
        marginLeft: 4,
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.darBlue,
    },
});
