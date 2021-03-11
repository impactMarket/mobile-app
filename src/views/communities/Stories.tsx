import { Screens } from 'helpers/constants';
import { addStoriesToState } from 'helpers/redux/actions/stories';
import { navigationRef } from 'helpers/rootNavigation';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';

import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ActivityIndicator, Headline } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
import NewStoryCard from './NewStoryCard';
import MyStoriesCard from './MyStoriesCard';
import StoriesCard from './StoriesCard';
import i18n from 'assets/i18n';

export default function Stories() {
    const dispatch = useDispatch();

    const [storiesCommunity, setStoriesCommunity] = useState<
        ICommunitiesListStories[]
    >([]);
    const [refreshing, setRefreshing] = useState(false);
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    useEffect(() => {
        setRefreshing(true);
        Api.story.list<ICommunitiesListStories[]>().then((s) => {
            setStoriesCommunity(s);
            dispatch(addStoriesToState(s));
            setRefreshing(false);
        });
    }, []);

    return (
        <SafeAreaView>
            <View
                style={{
                    marginHorizontal: 18,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 9,
                }}
            >
                <Headline>{i18n.t('stories')}</Headline>
                <Pressable
                    hitSlop={10}
                    onPress={(e) =>
                        navigationRef.current?.navigate(Screens.Stories, {
                            caller: 'VIEW_ALL',
                        })
                    }
                >
                    <Text
                        style={{
                            color: ipctColors.blueRibbon,
                            fontFamily: 'Gelion-Regular',
                            fontSize: 16,
                            lineHeight: 19,
                            textAlign: 'center',
                            letterSpacing: 0.366667,
                        }}
                    >
                        {i18n.t('viewAll')}
                    </Text>
                </Pressable>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 18 }}
            >
                {userAddress.length > 0 && (
                    <View style={{ flexDirection: 'column' }}>
                        <NewStoryCard key="newStory" />
                        <MyStoriesCard />
                    </View>
                )}
                {refreshing && (
                    <ActivityIndicator
                        style={{ marginBottom: 22 }}
                        animating
                        color={ipctColors.blueRibbon}
                    />
                )}
                {storiesCommunity.map((s) => (
                    <StoriesCard
                        key={s.id}
                        communityId={s.id}
                        communityName={s.name}
                        imageURI={s.story.media ? s.story.media : s.coverImage}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
