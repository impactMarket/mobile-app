import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { IRootState } from 'helpers/types/state';
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
        (state: IRootState) => state.stories.stories
    );
    const [index, setIndex] = useState(-1);

    useEffect(() => {
        setIndex(storiesListState.findIndex((s) => s.id));
    }, [storiesListState]);

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
        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
        }
    }, []);

    if (index === -1) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar hidden={true} />
            <FlatList
                data={storiesListState}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return <Carousel communityId={item.id} />;
                }}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                // Performance settings
                removeClippedSubviews // Unmount components when outside of window
                initialNumToRender={1} // Reduce initial render amount
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
