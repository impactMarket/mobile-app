import { Screens } from 'helpers/constants';
import { navigationRef } from 'helpers/rootNavigation';
import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Headline } from 'react-native-paper';
import NewStoryCard from './NewStoryCard';
import StoriesCard from './StoriesCard';

export default class Stories extends Component<{}, {}> {
    render() {
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
                    <NewStoryCard />
                    <StoriesCard />
                    <StoriesCard />
                    <StoriesCard />
                </ScrollView>
            </View>
        );
    }
}
