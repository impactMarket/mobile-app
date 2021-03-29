import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import BackSvg from 'components/svg/header/BackSvg';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { IRootState, IStoriesRouteParams } from 'helpers/types/state';
import { View, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
import StoriesCard from 'views/communities/StoriesCard';

interface ICommunityStoriesBox extends ICommunitiesListStories {
    empty: boolean;
}

function StoriesScreen() {
    const navigation = useNavigation();
    const route = useRoute<
        RouteProp<Record<string, IStoriesRouteParams>, string>
    >();

    const { caller } = route.params;

    const [stories, setStories] = useState<ICommunityStoriesBox[]>([]);

    const [refreshing, setRefreshing] = useState(false);

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    useEffect(() => {
        setRefreshing(true);
        if (caller !== 'MY_STORIES') {
            Api.story.list<ICommunityStoriesBox[]>().then((s) => {
                setStories(s);
            });
        } else {
            navigation.setOptions({
                headerTitle: 'My Stories',
            });
            Api.story.me<ICommunityStoriesBox[]>().then((s) => {
                setStories(s);
            });
        }
        setRefreshing(false);
    }, []);

    function createRows(data: ICommunityStoriesBox[], columns: number) {
        const rows = Math.floor(data.length / columns); // [A]
        let lastRowElements = data.length - rows * columns; // [B]
        while (lastRowElements !== columns) {
            // [C]
            data.push({
                // [D]
                id: lastRowElements,
                name: `empty-${lastRowElements}`,
                coverImage: '',
                empty: true,
                story: {} as any,
            });
            lastRowElements += 1; // [E]
        }
        return data; // [F]
    }

    if (refreshing) {
        return (
            <ActivityIndicator
                style={{ marginBottom: 22 }}
                animating
                color={ipctColors.blueRibbon}
            />
        );
    }

    return (
        <FlatList
            data={createRows(stories, 3)}
            style={{ marginHorizontal: 12 }}
            keyExtractor={(item) => item.name}
            numColumns={3} // Número de colunas
            renderItem={({ item }) => {
                if (item.empty) {
                    return <View style={[styles.item, styles.itemEmpty]} />;
                }
                return (
                    <StoriesCard
                        key={item.id}
                        communityId={item.id}
                        communityName={item.name}
                        imageURI={
                            item.story.media
                                ? item.story.media
                                : item.coverImage
                        }
                    />
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    itemEmpty: {
        backgroundColor: 'transparent',
    },
    item: {
        alignItems: 'center',
        backgroundColor: '#dcda48',
        flexGrow: 1,
        flexBasis: 0,
        margin: 6,
        padding: 20,
        height: 182,
        borderRadius: 8,
    },
    text: {
        color: '#333333',
    },
});

StoriesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: 'Stories',
    };
};

export default StoriesScreen;
