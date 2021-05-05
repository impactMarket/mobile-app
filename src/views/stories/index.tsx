import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { Screens } from 'helpers/constants';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { ICallerRouteParams } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Pressable } from 'react-native';
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
        RouteProp<Record<string, ICallerRouteParams>, string>
    >();

    const { caller } = route.params;

    const [stories, setStories] = useState<ICommunityStoriesBox[]>([]);

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setRefreshing(true);
        if (caller !== 'MY_STORIES') {
            Api.story.list<ICommunityStoriesBox[]>().then((s) => {
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

    console.log({ stories });
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

    return stories.length > 0 ? (
        <FlatList
            data={stories}
            style={{
                marginHorizontal: 12,
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
                    return <View style={[styles.item, styles.itemEmpty]} />;
                }
                return (
                    <StoriesCard
                        key={item.id}
                        communityId={item.id}
                        communityName={item.name}
                        imageURI={
                            item.story?.media
                                ? item.story.media.url
                                : item.cover?.url
                        }
                    />
                );
            }}
        />
    ) : (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                alignSelf: 'center',
            }}
        >
            <Text style={styles.title}>{i18n.t('emptyStoriesTitle')}</Text>
            <Text style={styles.text}>{i18n.t('emptyStoriesDescription')}</Text>
            <Pressable
                style={{
                    width: '80%',
                    height: 44,
                    marginTop: 24,
                }}
                onPress={() => navigation.navigate(Screens.NewStory)}
            >
                <View
                    style={{
                        backgroundColor: ipctColors.blueRibbon,
                        borderRadius: 6,
                        shadowColor: '#E1E4E7',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 14,
                        elevation: 4,
                        width: '100%',
                        height: '100%',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Gelion-Bold',
                            fontSize: 13,
                            lineHeight: 16,
                            color: ipctColors.white,
                        }}
                    >
                        {i18n.t('createStory')}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    itemEmpty: {
        backgroundColor: 'transparent',
    },
    item: {
        backgroundColor: '#dcda48',
        flexGrow: 1,
        flexBasis: 0,
        height: 167,
        borderRadius: 8,
    },
    title: {
        fontFamily: 'Manrope-Regular',
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
        textAlign: 'center',
        color: '#172032',
    },
    text: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'center',
        color: '#172032',
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
