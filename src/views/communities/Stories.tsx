import i18n from 'assets/i18n';
import { Screens } from 'helpers/constants';
import { chooseMediaThumbnail } from 'helpers/index';
import { addStoriesToStateRequest } from 'helpers/redux/actions/stories';
import { navigationRef } from 'helpers/rootNavigation';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

import MyStoriesCard from './MyStoriesCard';
import NewStoryCard from './NewStoryCard';
import StoriesCard from './StoriesCard';

export default function Stories() {
    const dispatch = useDispatch();

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    // const storiesCommunity = useSelector(
    //     (state: IRootState) => state.stories.stories
    // );

    // const refreshing = useSelector(
    //     (state: IRootState) => state.stories.refreshing
    // );
    const [refreshing, setRefreshing] = useState(false);

    const userCommunityMetadata = useSelector(
        (state: IRootState) => state.user.community
    );

    const [storiesCommunity, setStoriesCommunity] = useState([]);
    const [countStories, setCountStories] = useState(0);

    // This is necessary because the useEffect doesn't triggers when coming from the same stack (stackNavigation).
    // useFocusEffect(
    //     useCallback(() => {
    //         dispatch(addStoriesToStateRequest(0, 5));
    //     }, [])
    // );
    /**
     * Code Before Sagas
     * */

    useEffect(() => {
        setRefreshing(true);
        Api.story.list<ICommunitiesListStories[]>(0, 5).then((s) => {
            setStoriesCommunity(s.data);
            setCountStories(s.count);
            // dispatch(addStoriesToState(s));
            dispatch(addStoriesToStateRequest(0, 5));
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
                    alignItems: 'center',
                    marginBottom: 9,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Gelion-Bold',
                        fontSize: 20,
                        lineHeight: 23.44,
                        color: '#1E3252',
                    }}
                >
                    {i18n.t('stories')}
                </Text>
                <Pressable
                    hitSlop={10}
                    onPress={() =>
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
                        {i18n.t('viewAll')} ({countStories})
                    </Text>
                </Pressable>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 14 }}
            >
                {userAddress.length > 0 &&
                    (userCommunityMetadata.isBeneficiary ||
                        userCommunityMetadata.isManager) &&
                    userCommunityMetadata.metadata.status === 'valid' && (
                        <View
                            style={{
                                flexDirection: 'column',
                                width: 114,
                                height: 167,
                            }}
                        >
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
                {storiesCommunity.length > 0 &&
                    storiesCommunity.map((s) => (
                        <StoriesCard
                            key={s.id}
                            communityId={s.id}
                            communityName={s.name}
                            imageURI={
                                s.story.media
                                    ? chooseMediaThumbnail(s.story.media, {
                                          width: 84,
                                          heigth: 140,
                                      })
                                    : chooseMediaThumbnail(s.cover, {
                                          width: 88,
                                          heigth: 88,
                                      })
                            }
                        />
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}
