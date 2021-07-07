import i18n from 'assets/i18n';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Select from 'components/core/Select';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import * as Location from 'expo-location';
import { ITabBarIconProps } from 'helpers/types/common';
// import { ICommunityLightDetails } from 'helpers/types/endpoints';
import { CommunityAttributes } from 'helpers/types/models';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { ActivityIndicator, RadioButton, Portal } from 'react-native-paper';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import CommunityCard from './CommunityCard';
import Stories from './Stories';

function CommunitiesScreen() {
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);
    const modalizeOrderRef = useRef<Modalize>(null);
    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    const [communtiesOrder, setCommuntiesOrder] = useState('bigger');
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);

    const [refreshing, setRefreshing] = useState(true);
    const [communities, setCommunities] = useState<CommunityAttributes[]>([]);
    const [reachedEndList, setReachedEndList] = useState(false);

    useEffect(() => {
        Api.community
            .list({
                offset: 0,
                limit: 5,
            })
            .then((c) => {
                if (c.length < 5) {
                    setReachedEndList(true);
                } else {
                    setReachedEndList(false);
                }
                setCommunities(c);
            })
            .finally(() => setRefreshing(false));
    }, []);

    const handleChangeOrder = async (order: string) => {
        modalizeOrderRef.current?.close();
        setRefreshing(true);
        setCommuntiesOrder(order);
        //
        const previousCommunities = communities;
        setCommunities([]);
        flatListRef.current?.scrollToIndex({ index: 0 });
        if (order === 'nearest') {
            try {
                const { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        i18n.t('failure'),
                        i18n.t('errorGettingGPSLocation'),
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                    return;
                }
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low,
                });
                setUserLocation(location);
                Api.community
                    .list({
                        offset: 0,
                        limit: 5,
                        orderBy: 'nearest',
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                    })
                    .then((c) => {
                        if (c.length < 5) {
                            setReachedEndList(true);
                        } else {
                            setReachedEndList(false);
                        }
                        setCommunities(c);
                        setCommuntiesOffset(0);
                    })
                    .finally(() => setRefreshing(false));
            } catch (e) {
                setCommunities(previousCommunities);
                setCommuntiesOrder('bigger');
                setRefreshing(false);
            }
        } else {
            Api.community
                .list({
                    offset: 0,
                    limit: 5,
                })
                .then((c) => {
                    if (c.length < 5) {
                        setReachedEndList(true);
                    } else {
                        setReachedEndList(false);
                    }
                    setCommunities(c);
                    setCommuntiesOffset(0);
                })
                .finally(() => setRefreshing(false));
        }
    };

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        console.log(info);
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            if (communtiesOrder === 'nearest' && userLocation) {
                Api.community
                    .list({
                        offset: communtiesOffset + 10,
                        limit: 10,
                        orderBy: 'nearest',
                        lat: userLocation.coords.latitude,
                        lng: userLocation.coords.longitude,
                    })
                    .then((c) => {
                        if (c.length < 10) {
                            setReachedEndList(true);
                        }
                        setCommunities(communities.concat(c));
                        setCommuntiesOffset(communtiesOffset + 10);
                    })
                    .finally(() => setRefreshing(false));
            } else {
                Api.community
                    .list({
                        offset: communtiesOffset + 10,
                        limit: 10,
                    })
                    .then((c) => {
                        if (c.length < 10) {
                            setReachedEndList(true);
                        }
                        setCommunities(communities.concat(c));
                        setCommuntiesOffset(communtiesOffset + 10);
                    })
                    .finally(() => setRefreshing(false));
            }
        }
    };

    const textCommunitiesOrder = (g: string | null) => {
        switch (g) {
            case 'nearest':
                return i18n.t('nearest');
            default:
                return i18n.t('bigger');
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
                {refreshing && (
                    <ActivityIndicator
                        style={{ marginBottom: 22 }}
                        animating
                        color={ipctColors.blueRibbon}
                    />
                )}
            </>
        );
    };

    const ITEM_HEIGHT = 147;

    const getItemLayout = useCallback(
        (data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        []
    );

    const renderItem = useCallback(
        ({ item, index }: { item: CommunityAttributes; index: number }) =>
            index === 0 ? filterHeader() : <CommunityCard community={item} />,
        []
    );

    const keyExtractor = useCallback((item) => item.publicId, []);

    return (
        <>
            <FlatList
                ref={flatListRef}
                data={[
                    { publicId: 'for-compliance-sake-really' } as any,
                ].concat(communities)}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReachedThreshold={0.7}
                onEndReached={handleOnEndReached}
                showsVerticalScrollIndicator={false}
                // Performance settings
                removeClippedSubviews // Unmount components when outside of window
                initialNumToRender={4} // Reduce initial render amount
                maxToRenderPerBatch={4} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={5} // Reduce the window size
                style={{ paddingTop: 20 }}
                getItemLayout={getItemLayout}
            />
            <Portal>
                <Modalize
                    ref={modalizeOrderRef}
                    HeaderComponent={renderHeader(
                        i18n.t('order'),
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
                                label={i18n.t('bigger')}
                                value="bigger"
                            />
                            <RadioButton.Item
                                key="nearest"
                                label={i18n.t('nearest')}
                                value="nearest"
                            />
                        </RadioButton.Group>
                    </View>
                </Modalize>
            </Portal>
        </>
    );
}

CommunitiesScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('communities'),
        tabBarLabel: i18n.t('communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

export default CommunitiesScreen;
