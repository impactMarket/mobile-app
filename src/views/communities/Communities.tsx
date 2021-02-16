import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import { ICommunityLightDetails } from 'helpers/types/endpoints';
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ActivityIndicator, Headline } from 'react-native-paper';
import Api from 'services/api';
import { iptcColors } from 'styles/index';

import CommunityCard from './CommunityCard';

function Communities() {
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList<ICommunityLightDetails> | null>(null);
    const [refreshing, setRefreshing] = useState(true);
    const [communities, setCommunities] = useState<ICommunityLightDetails[]>(
        []
    );

    useEffect(() => {
        Api.community
            .list(0, 5)
            .then((c) => {
                setCommunities(c);
            })
            .finally(() => setRefreshing(false));
    }, []);

    return (
        <View
            style={{
                // backgroundColor: 'red',
                marginBottom: 10,
            }}
        >
            <View
                style={{
                    // backgroundColor: 'red',
                    marginHorizontal: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 9,
                }}
            >
                <Headline>Communities</Headline>
                <Text
                    onPress={(e) =>
                        navigation.navigate(Screens.CommunitiesList)
                    }
                >
                    View All
                </Text>
            </View>
            {refreshing && (
                <ActivityIndicator
                    style={{ marginBottom: 22 }}
                    animating
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
                // onEndReached={handleOnEndReached}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // Performance settings
                removeClippedSubviews // Unmount components when outside of window
                initialNumToRender={2} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
            />
        </View>
    );
}

export default Communities;
