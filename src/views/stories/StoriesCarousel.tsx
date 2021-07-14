import { StatusBar } from 'expo-status-bar';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import Carousel from './Carousel';

interface IStoriesCarouselScreen {
    route: {
        params: {
            communityId: number;
        };
    };
}
function StoriesCarouselScreen(props: IStoriesCarouselScreen) {
    const storiesListState = useSelector(
        (state: IRootState) => state.stories.stories.data
    );

    const flatListRef = useRef<FlatList<ICommunitiesListStories> | null>(null);
    const [index, setIndex] = useState(-1);

    useEffect(() => {
        setIndex(
            storiesListState.findIndex(
                (s) => s.id === props.route.params.communityId
            )
        );
    }, [storiesListState, props.route.params.communityId]);

    const indexRef = useRef(index);

    indexRef.current = index;

    const onScroll = useCallback((event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        const distance = Math.abs(roundIndex - index);

        // Prevent one pixel triggering setIndex in the middle
        // of the transition. With this we have to scroll a bit
        // more to trigger the index change.
        const isNoMansLand = distance > 0.4;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
        }
    }, []);

    /**
     * returns new community id, or null if there's no previous or next
     */

    const goToOtherCommunity = (next: boolean): void => {
        if (index > 0 && !next) {
            flatListRef.current?.scrollToIndex({ index: index - 1 });
            setIndex(index - 1);
        } else if (index < storiesListState.length - 1 && next) {
            flatListRef.current?.scrollToIndex({ index: index + 1 });
            setIndex(index + 1);
        }
    };
    console.log({ index });
    // if (index === -1) {
    //     return null;
    // }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <StatusBar hidden />

            <FlatList
                data={storiesListState}
                ref={flatListRef}
                keyExtractor={(item) => item.id.toString()}
                style={{
                    flex: 1,
                }}
                renderItem={({ item }) => {
                    return (
                        <Carousel
                            communityId={item.id}
                            goToOtherCommunity={goToOtherCommunity}
                        />
                    );
                }}
                initialScrollIndex={index}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise((resolve) =>
                        setTimeout(resolve, 300)
                    );
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({
                            index: info.index,
                            animated: true,
                        });
                    });
                }}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                // Performance settings
                removeClippedSubviews // Unmount components when outside of window
                initialNumToRender={10} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
            />
        </View>
    );
}

StoriesCarouselScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

export default StoriesCarouselScreen;
