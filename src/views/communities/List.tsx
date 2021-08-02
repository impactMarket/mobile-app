import IconCommunity from 'components/svg/IconCommunity';
import LocationsSvg from 'components/svg/LocationSvg';
import SuspiciousActivityMiddleSvg from 'components/svg/SuspiciousActivityMiddleSvg';
import BackSvg from 'components/svg/header/BackSvg';
import * as Location from 'expo-location';
import { CommunityAttributes } from 'helpers/types/models';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Api from 'services/api';

function Dot() {
    return (
        <Text
            style={{
                marginHorizontal: 4,
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                lineHeight: 20,
                color: '#73839D',
            }}
        >
            ·
        </Text>
    );
}

function ListItem(props: { community: CommunityAttributes }) {
    return (
        <View
            style={{
                height: 92,
                marginBottom: 26,
                marginHorizontal: 22,
                flex: 1,
                flexDirection: 'row',
                // backgroundColor: 'red',
            }}
        >
            <View
                style={{
                    borderRadius: 12,
                    width: 82,
                    backgroundColor: '#172B4D',
                }}
            >
                <Image
                    source={{ uri: props.community.cover!.url! }}
                    style={{
                        flex: 1,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                    }}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center', // horizontal align
                        alignItems: 'center', // vertical align
                    }}
                >
                    <IconCommunity />
                    <Text
                        style={{
                            color: 'white',
                            marginLeft: 4,
                        }}
                    >
                        {props.community.state!.beneficiaries}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    marginLeft: 16,
                    justifyContent: 'space-between',
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        lineHeight: 22,
                        fontSize: 16,
                        fontWeight: '800',
                        fontFamily: 'Manrope-SemiBold',
                        color: '#1E3252',
                    }}
                >
                    {props.community.name}
                </Text>
                <View>
                    <View
                        style={{
                            // flex: 1,
                            flexDirection: 'row',
                            marginBottom: 12,
                            alignItems: 'center',
                            // backgroundColor: 'yellow',
                        }}
                    >
                        <SuspiciousActivityMiddleSvg />
                        <Dot />
                        <Text
                            style={{
                                fontFamily: 'Inter-Bold',
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#73839D',
                            }}
                        >
                            UBI
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#73839D',
                            }}
                        >
                            {' '}
                            $0.67/day
                        </Text>
                        <Dot />
                        <LocationsSvg />
                        <Text
                            style={{
                                marginLeft: 4,
                                fontFamily: 'Inter-Regular',
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#73839D',
                            }}
                        >
                            Democratic Republic of the Congo
                        </Text>
                    </View>
                    <ProgressBar
                        progress={0.2}
                        color="#8A9FC2"
                        style={{
                            borderRadius: 6.5,
                            height: 4,
                            backgroundColor: '#E9ECEF',
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

function ListCommunitiesScreen() {
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);

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
                limit: 10,
            })
            .then((c) => {
                if (c.length < 10) {
                    setReachedEndList(true);
                } else {
                    setReachedEndList(false);
                }
                setCommunities(c);
            })
            .finally(() => setRefreshing(false));
    }, []);

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            let queryList: {
                offset: number;
                limit: number;
                orderBy?: string;
                filter?: string;
                lat?: number;
                lng?: number;
            } = { offset: 0, limit: 10 };
            if (communtiesOrder === 'nearest' && userLocation) {
                queryList = {
                    ...queryList,
                    orderBy: 'nearest',
                    lat: userLocation.coords.latitude,
                    lng: userLocation.coords.longitude,
                };
            }
            Api.community
                .list(queryList)
                .then((c) => {
                    if (c.length < 10) {
                        setReachedEndList(true);
                    }
                    // as the users keeps scrolling, communities might get a different order
                    // and eventually be repeated
                    setCommunities([
                        ...new Map(
                            [...communities, ...c].map((item) => [
                                item.id,
                                item,
                            ])
                        ).values(),
                    ]);
                    setCommuntiesOffset(communtiesOffset + 10);
                })
                .finally(() => setRefreshing(false));
        }
    };

    return (
        <FlatList
            data={communities}
            renderItem={({ item }: { item: CommunityAttributes }) => (
                <ListItem community={item} />
            )}
            ref={flatListRef}
            keyExtractor={(item) => item.publicId}
            onEndReachedThreshold={0.5}
            onEndReached={handleOnEndReached}
            showsVerticalScrollIndicator={false}
            // Performance settings
            // removeClippedSubviews // Unmount components when outside of window
            // initialNumToRender={4} // Reduce initial render amount
            // maxToRenderPerBatch={2} // Reduce number in each render batch
            // updateCellsBatchingPeriod={100} // Increase time between renders
            // windowSize={7} // Reduce the window size
            style={{ paddingTop: 20 }}
        />
    );
}

ListCommunitiesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: '',
    };
};

export default ListCommunitiesScreen;
