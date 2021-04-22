import { useNavigation, RouteProp } from '@react-navigation/native';
import i18n from 'assets/i18n';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import Select from 'components/core/Select';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import * as Location from 'expo-location';
import { ITabBarIconProps } from 'helpers/types/common';
import { ICommunityLightDetails } from 'helpers/types/endpoints';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, View, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import { Portal } from 'react-native-portalize';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import CommunityCard from './CommunityCard';

// import Stories from './Stories';

function CommunitiesScreen() {
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList<ICommunityLightDetails> | null>(null);
    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    const [communtiesOrder, setCommuntiesOrder] = useState('bigger');
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);
    const [refreshing, setRefreshing] = useState(true);
    const [communities, setCommunities] = useState<ICommunityLightDetails[]>(
        []
    );
    const [reachedEndList, setReachedEndList] = useState(false);
    const modalizeOrderRef = useRef<Modalize>(null);

    useEffect(() => {
        Api.community
            .list(0, 5)
            .then((c) => {
                if (c.length < 5) {
                    setReachedEndList(true);
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
                    .listNearest(
                        location.coords.latitude,
                        location.coords.longitude,
                        0,
                        5
                    )
                    .then((c) => {
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
                .list(0, 5)
                .then((c) => {
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
                    .listNearest(
                        userLocation.coords.latitude,
                        userLocation.coords.longitude,
                        communtiesOffset + 5,
                        5
                    )
                    .then((c) => {
                        if (c.length < 5) {
                            setReachedEndList(true);
                        }
                        setCommunities(communities.concat(c));
                        setCommuntiesOffset(communtiesOffset + 5);
                    })
                    .finally(() => setRefreshing(false));
            } else {
                Api.community
                    .list(communtiesOffset + 5, 5)
                    .then((c) => {
                        if (c.length < 5) {
                            setReachedEndList(true);
                        }
                        setCommunities(communities.concat(c));
                        setCommuntiesOffset(communtiesOffset + 5);
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

    const handleOpenModalize = () => {
        //TODO: Hide dinamically the header
        // navigation.setOptions({ headerShown: false });
        modalizeOrderRef.current?.open();
    };

    const filterHeader = () => {
        return (
            <>
                {/* <Stories /> */}
                <View style={{ marginHorizontal: 16, marginVertical: 22 }}>
                    <Select
                        label={i18n.t('order')}
                        value={textCommunitiesOrder(communtiesOrder)}
                        onPress={handleOpenModalize}
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
                    item: ICommunityLightDetails;
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
                onEndReachedThreshold={0.7}
                onEndReached={handleOnEndReached}
                showsVerticalScrollIndicator={false}
                // Performance settings
                removeClippedSubviews // Unmount components when outside of window
                initialNumToRender={2} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
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
                            height: Dimensions.get('screen').height * 0.9,
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

CommunitiesScreen.navigationOptions = ({
    route,
}: {
    route: RouteProp<any, any>;
}) => {
    return {
        headerTitle: i18n.t('communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

export default CommunitiesScreen;
