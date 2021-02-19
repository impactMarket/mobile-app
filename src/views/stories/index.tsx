import BackSvg from 'components/svg/header/BackSvg';
import { ICommunityStories } from 'helpers/types/endpoints';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Api from 'services/api';
import StoriesCard from 'views/communities/StoriesCard';

interface ICommunityStoriesBox extends ICommunityStories {
    empty: boolean;
}
function StoriesScreen() {
    const [storiesCommunity, setStoriesCommunity] = useState<
        ICommunityStoriesBox[]
    >([]);

    useEffect(() => {
        Api.story
            .get<ICommunityStoriesBox[]>()
            .then((s) => setStoriesCommunity(s));
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
                empty: true,
                stories: [],
            });
            lastRowElements += 1; // [E]
        }
        return data; // [F]
    }

    return (
        <FlatList
            data={createRows(storiesCommunity, 3)}
            style={{ marginHorizontal: 12 }}
            keyExtractor={(item) => item.name}
            numColumns={3} // Número de colunas
            renderItem={({ item }) => {
                if (item.empty) {
                    return <View style={[styles.item, styles.itemEmpty]} />;
                }
                return (
                    <StoriesCard
                        communityName={item.name}
                        imageURI={item.stories[0].media}
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
