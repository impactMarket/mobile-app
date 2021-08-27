import i18n from 'assets/i18n';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Select from 'components/core/Select';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import * as Location from 'expo-location';
import {
    cleanCommunitiesListState,
    fetchCommunitiesListRequest,
} from 'helpers/redux/actions/communities';
import { ITabBarIconProps } from 'helpers/types/common';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { RadioButton, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import CommunityCard from './CommunityCard';
import Stories from './Stories';

function CommunitiesScreen() {
    const dispatch = useDispatch();
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);
    const modalizeOrderRef = useRef<Modalize>(null);
    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    const [communtiesOrder, setCommuntiesOrder] = useState('bigger');
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);

    const [, setRefreshing] = useState(true);
    const communities = useSelector(
        (state: IRootState) => state.communities.communities
    );

    const reachedEndList = useSelector(
        (state: IRootState) => state.communities.reachedEndList
    );

    useEffect(() => {
        dispatch(
            fetchCommunitiesListRequest({
                offset: 0,
                limit: 5,
            })
        );
    }, [dispatch]);

    const handleChangeOrder = async (order: string) => {
        modalizeOrderRef.current?.close();
        setRefreshing(true);
        setCommuntiesOrder(order);
        flatListRef.current?.scrollToIndex({ index: 0 });
        if (order === 'nearest') {
            try {
                const { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        i18n.t('generic.failure'),
                        i18n.t('generic.errorGettingGPSLocation'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                    return;
                }
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low,
                });

                setUserLocation(location);
                dispatch(cleanCommunitiesListState());

                dispatch(
                    fetchCommunitiesListRequest({
                        offset: 0,
                        limit: 5,
                        orderBy: 'nearest',
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                    })
                );

                setCommuntiesOffset(0);
            } catch (e) {
                setCommuntiesOrder('bigger');
                setRefreshing(false);
            }
        } else {
            dispatch(cleanCommunitiesListState());
            dispatch(
                fetchCommunitiesListRequest({
                    offset: 0,
                    limit: 5,
                })
            );
        }
    };

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!reachedEndList) {
            setRefreshing(true);
            if (communtiesOrder === 'nearest' && userLocation) {
                dispatch(
                    fetchCommunitiesListRequest({
                        offset: communtiesOffset + 5,
                        limit: 5,
                        orderBy: 'nearest',
                        lat: userLocation.coords.latitude,
                        lng: userLocation.coords.longitude,
                    })
                );

                setCommuntiesOffset(communtiesOffset + 5);
                setRefreshing(false);
            } else {
                dispatch(
                    fetchCommunitiesListRequest({
                        offset: communtiesOffset + 5,
                        limit: 5,
                    })
                );

                setCommuntiesOffset(communtiesOffset + 5);
                setRefreshing(false);
            }
        }
    };

    const textCommunitiesOrder = (g: string | null) => {
        switch (g) {
            case 'nearest':
                return i18n.t('generic.nearest');
            default:
                return i18n.t('generic.bigger');
        }
    };

    const filterHeader = () => {
        return (
            <>
                <Stories />
                <View style={{ marginHorizontal: 16, marginBottom: 22 }}>
                    <Select
                        value={textCommunitiesOrder(communtiesOrder)}
                        onPress={() => modalizeOrderRef.current?.open()}
                    />
                </View>
                {/* {refreshing && (
                    <ActivityIndicator
                        style={{ marginBottom: 22 }}
                        animating
                        color={ipctColors.blueRibbon}
                    />
                )} */}
            </>
        );
    };

    const renderCommunityOrder = () => {
        return (
            <Modalize
                ref={modalizeOrderRef}
                HeaderComponent={renderHeader(
                    i18n.t('generic.order'),
                    modalizeOrderRef
                )}
                adjustToContentHeight
            >
                <View
                    style={{
                        height: 110,
                    }}
                >
                    <RadioButton.Group
                        onValueChange={(value) => handleChangeOrder(value)}
                        value={communtiesOrder}
                    >
                        <RadioButton.Item
                            key="bigger"
                            label={i18n.t('generic.bigger')}
                            value="bigger"
                        />
                        <RadioButton.Item
                            key="nearest"
                            label={i18n.t('generic.nearest')}
                            value="nearest"
                        />
                    </RadioButton.Group>
                </View>
            </Modalize>
        );
    };

    return (
        <>
            <FlatList
                data={[
                    { publicId: 'for-compliance-sake-really' } as any,
                ].concat(communities)}
                renderItem={({
                    item,
                    index,
                }: {
                    item: CommunityAttributes;
                    index: number;
                }) =>
                    index === 0 ? (
                        filterHeader()
                    ) : (
                        <CommunityCard community={item} />
                    )
                }
                ref={flatListRef}
                keyExtractor={(item) => item.publicId}
                onEndReachedThreshold={0.5}
                onEndReached={handleOnEndReached}
                showsVerticalScrollIndicator={false}
                style={{ paddingTop: 20 }}
            />
            <Portal>{renderCommunityOrder()}</Portal>
        </>
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

export default CommunitiesScreen;
