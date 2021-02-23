import { Screens } from 'helpers/constants';
import { navigationRef } from 'helpers/rootNavigation';
import {
    ICommunitiesListStories,
    ICommunityStories,
} from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import React, { Component, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ActivityIndicator, Headline } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';
import NewStoryCard from './NewStoryCard';
import StoriesCard from './StoriesCard';

export default function Stories() {
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
            setRefreshing(false);
        });
    }, []);

    return (
        <View>
            <View
                style={{
                    marginHorizontal: 18,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 9,
                }}
            >
                <Headline>Stories</Headline>
                <Pressable
                    hitSlop={10}
                    onPress={(e) =>
                        navigationRef.current?.navigate(Screens.Stories)
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
                        View All
                    </Text>
                </Pressable>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 18 }}
            >
                {userAddress.length > 0 && <NewStoryCard key="newStory" />}
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
        </View>
    );
}
