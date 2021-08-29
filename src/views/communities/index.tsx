import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import * as Location from 'expo-location';
import { Screens } from 'helpers/constants';
import { fetchCommunitiesListRequest } from 'helpers/redux/actions/communities';
import { ITabBarIconProps } from 'helpers/types/common';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

import CommunityCard from './CommunityCard';
import Stories from './Stories';

function CommunitiesScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const walletAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    const isManager = useSelector(
        (state: IRootState) => state.user.community.isManager
    );

    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);
    // const [communtiesOffset, setCommuntiesOffset] = useState(0);
    // const [communtiesOrder, setCommuntiesOrder] = useState('bigger');
    // const [userLocation, setUserLocation] = useState<
    //     Location.LocationObject | undefined
    // >(undefined);

    const [, setRefreshing] = useState(true);
    const communities = useSelector(
        (state: IRootState) => state.communities.communities
    );

    // const reachedEndList = useSelector(
    //     (state: IRootState) => state.communities.reachedEndList
    // );

    useEffect(() => {
        dispatch(
            fetchCommunitiesListRequest({
                offset: 0,
                limit: 5,
            })
        );
    }, [dispatch]);

    // const handleOnEndReached = (info: { distanceFromEnd: number }) => {
    //     if (!reachedEndList) {
    //         setRefreshing(true);
    //         if (communtiesOrder === 'nearest' && userLocation) {
    //             dispatch(
    //                 fetchCommunitiesListRequest({
    //                     offset: communtiesOffset + 5,
    //                     limit: 5,
    //                     orderBy: 'nearest',
    //                     lat: userLocation.coords.latitude,
    //                     lng: userLocation.coords.longitude,
    //                 })
    //             );

    //             setCommuntiesOffset(communtiesOffset + 5);
    //             setRefreshing(false);
    //         } else {
    //             dispatch(
    //                 fetchCommunitiesListRequest({
    //                     offset: communtiesOffset + 5,
    //                     limit: 5,
    //                 })
    //             );

    //             setCommuntiesOffset(communtiesOffset + 5);
    //             setRefreshing(false);
    //         }
    //     }
    // };

    return (
        <ScrollView>
            <FlatList
                data={[
                    { publicId: 'for-compliance-sake-really' } as any,
                ].concat(communities)}
                renderItem={({
                    item,
                }: // index,
                {
                    item: CommunityAttributes;
                    index: number;
                }) => <CommunityCard community={item} />}
                ref={flatListRef}
                keyExtractor={(item) => item.publicId}
                // onEndReachedThreshold={0.5}
                // onEndReached={handleOnEndReached}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingTop: 20, marginLeft: 14 }}
            />
            <Button
                modeType="default"
                style={{ marginHorizontal: 22, marginBottom: 36 }}
                labelStyle={styles.buttomStoreText}
                onPress={() =>
                    walletAddress.length > 0
                        ? navigation.navigate(Screens.CreateCommunity)
                        : isManager
                        ? navigation.navigate(Screens.CommunityManager)
                        : navigation.navigate(Screens.Auth)
                }
            >
                <Text style={styles.buttomStoreText}>
                    {i18n.t('createCommunity.applyCommunity')}
                </Text>
            </Button>
            <Stories />
        </ScrollView>
    );
}

CommunitiesScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('generic.communities'),
        tabBarLabel: i18n.t('generic.communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    buttomStoreText: {
        fontSize: ipctFontSize.smaller,
        lineHeight: ipctLineHeight.large,
        color: ipctColors.white,
        fontFamily: 'Inter-Regular',
        fontWeight: '500',
    },
});

export default CommunitiesScreen;
