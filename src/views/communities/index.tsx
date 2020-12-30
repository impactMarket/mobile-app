import i18n from 'assets/i18n';
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import Api from 'services/api';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import { ICommunityLightDetails } from 'helpers/types/endpoints';
import { ITabBarIconProps } from 'helpers/types/common';
import CommunityCard from './CommunityCard';
import Select from 'components/core/Select';
import { ActivityIndicator, Dialog, RadioButton } from 'react-native-paper';
import { iptcColors } from 'styles/index';
import * as Location from 'expo-location';

function CommunitiesScreen() {
    const flatListRef = useRef<FlatList<ICommunityLightDetails> | null>(null);
    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    const [communtiesOrder, setCommuntiesOrder] = useState('bigger');
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);
    const [isDialogOrderOpen, setIsDialogOrderOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const [communities, setCommunities] = useState<ICommunityLightDetails[]>(
        []
    );

    useEffect(() => {
        Api.community
            .list(0, 5)
            .then((c) => setCommunities(c))
            .finally(() => setRefreshing(false));
    }, []);

    const handleChangeOrder = async (order: string) => {
        setIsDialogOrderOpen(false);
        setRefreshing(true);
        setCommuntiesOrder(order);
        //
        const previousCommunities = communities;
        setCommunities([]);
        flatListRef.current?.scrollToIndex({ index: 0 });
        if (order === 'nearest') {
            try {
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

    const textCommunitiesOrder = (g: string | null) => {
        switch (g) {
            case 'nearest':
                return i18n.t('nearest');
            default:
                return i18n.t('bigger');
        }
    };

    return (
        <>
            <View style={{ marginHorizontal: 16, marginBottom: 22 }}>
                <Select
                    label={i18n.t('order')}
                    value={textCommunitiesOrder(communtiesOrder)}
                    onPress={() => setIsDialogOrderOpen(true)}
                />
            </View>
            {refreshing && (
                <ActivityIndicator
                    style={{ marginBottom: 22 }}
                    animating={true}
                    color={iptcColors.blueRibbon}
                />
            )}
            <FlatList
                data={communities}
                renderItem={({ item }: { item: ICommunityLightDetails }) => (
                    <CommunityCard community={item} />
                )}
                ref={flatListRef}
                keyExtractor={(item) => item.publicId}
                onEndReachedThreshold={0.7}
                onEndReached={(info: { distanceFromEnd: number }) => {
                    if (!refreshing) {
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
                                    setCommunities(communities.concat(c));
                                    setCommuntiesOffset(communtiesOffset + 5);
                                })
                                .finally(() => setRefreshing(false));
                        } else {
                            Api.community
                                .list(communtiesOffset + 5, 5)
                                .then((c) => {
                                    setCommunities(communities.concat(c));
                                    setCommuntiesOffset(communtiesOffset + 5);
                                })
                                .finally(() => setRefreshing(false));
                        }
                    }
                }}
                // Performance settings
                removeClippedSubviews={true} // Unmount components when outside of window
                initialNumToRender={2} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
            />
            <Dialog
                visible={isDialogOrderOpen}
                onDismiss={() => setIsDialogOrderOpen(false)}
            >
                <Dialog.Content>
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
                </Dialog.Content>
            </Dialog>
        </>
    );
}

CommunitiesScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

export default CommunitiesScreen;
