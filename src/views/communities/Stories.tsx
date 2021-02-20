import { Screens } from 'helpers/constants';
import { navigationRef } from 'helpers/rootNavigation';
import { ICommunityStories } from 'helpers/types/endpoints';
import React, { Component, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Headline } from 'react-native-paper';
import Api from 'services/api';
import NewStoryCard from './NewStoryCard';
import StoriesCard from './StoriesCard';

export default function Stories() {
    const [storiesCommunity, setStoriesCommunity] = useState<
        ICommunityStories[]
    >([]);

    useEffect(() => {
        Api.story.list<ICommunityStories[]>().then((s) => {
            setStoriesCommunity(s);
            console.log(s);
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
                <Text
                    onPress={(e) =>
                        navigationRef.current?.navigate(Screens.Stories)
                    }
                >
                    View All
                </Text>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 18 }}
            >
                <NewStoryCard key="newStory" />
                {storiesCommunity.map((s) => (
                    <StoriesCard
                        key={s.id}
                        communityId={s.id}
                        communityName={s.name}
                        imageURI={s.stories[s.stories.length - 1].media}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
