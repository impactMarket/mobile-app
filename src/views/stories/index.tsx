import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { IRootState, ICallerRouteParams } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
import StoriesCard from 'views/communities/StoriesCard';
interface ICommunityStoriesBox extends ICommunitiesListStories {
    empty: boolean;
}

function StoriesScreen() {
    const navigation = useNavigation();
    const route = useRoute<
        RouteProp<Record<string, ICallerRouteParams>, string>
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
                // console.log(s);
                setStories(s);
            });
        } else {
            navigation.setOptions({
                headerTitle: i18n.t('myStories'),
            });
            Api.story.me<ICommunityStoriesBox[]>().then((s) => {
                setStories(s);
            });
        }
        setRefreshing(false);
    }, []);

    function createRows(data: ICommunityStoriesBox[], columns: number) {
        // console.log('data', data);
        const rows = Math.floor(data.length / columns); // [A]
        let lastRowElements = data.length - rows * columns; // [B]
        while (lastRowElements !== columns) {
            // [C]
            data.push({
                // [D]
                id: lastRowElements,
                name: `empty-${lastRowElements}`,
                empty: true,
                story: {} as any, // empty on purpose
                cover: {} as any, // empty on purpose
            });
            lastRowElements += 1; // [E]
        }
        // console.log(data);
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
            data={stories}
            style={{
                marginHorizontal: 12,
                // backgroundColor: 'blue',
            }}
            contentContainerStyle={
                {
                    // alignItems: 'flex-start',
                }
            }
            keyExtractor={(item) => item.name}
            numColumns={3} // Número de colunas
            renderItem={({ item }) => {
                if (item.empty) {
                    return (
                        <View
                            style={[
                                styles.item,
                                styles.itemEmpty,
                                // { backgroundColor: 'red' },
                            ]}
                        />
                    );
                }
                return (
                    <StoriesCard
                        key={item.id}
                        communityId={item.id}
                        communityName={item.name}
                        imageURI={
                            item.story.media
                                ? item.story.media.url
                                : item.cover.url
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
        // alignItems: 'center',
        backgroundColor: '#dcda48',
        flexGrow: 1,
        flexBasis: 0,
        // margin: 6,
        // padding: 20,
        // width: 98.16,
        height: 167,
        borderRadius: 8,
        // marginRight: 11.84,
    },
    text: {
        color: '#333333',
    },
});

StoriesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('stories'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
        },
    };
};

export default StoriesScreen;
