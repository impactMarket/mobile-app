import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import { useNavigation } from '@react-navigation/native';
import StoryLoveSvg from 'components/svg/StoryLoveSvg';
import Button from 'components/core/Button';
import Api from 'services/api';
import { ICommunityStory } from 'helpers/types/endpoints';
import CarouselSlide from './CarouselSlide';
import countriesJSON from 'assets/countries.json';
import { Screens } from 'helpers/constants';
import { ActivityIndicator } from 'react-native-paper';
import { ipctColors } from 'styles/index';
import { useSelector } from 'react-redux';
import { IRootState } from 'helpers/types/state';
import i18n from 'assets/i18n';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        phone: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;
interface IStoriesCarouselScreen {
    route: {
        params: {
            communityId: number;
        };
    };
}
function StoriesCarouselScreen(props: IStoriesCarouselScreen) {
    const navigation = useNavigation();

    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const [index, setIndex] = useState(0);
    const [stories, setStories] = useState<ICommunityStory[]>([]);
    const [lovedStories, setLovedStories] = useState<boolean[]>([]);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [name, setName] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [communityPublicId, setCommunityPublicId] = useState('');

    useEffect(() => {
        Api.story
            .getByCommunity(
                props.route.params.communityId,
                userAddress.length > 0
            )
            .then((s) => {
                setName(s.name);
                setCity(s.city);
                setCountry(s.country);
                setCoverImage(s.coverImage);
                setCommunityPublicId(s.publicId);
                setStories(s.stories);
                if (userAddress.length > 0) {
                    setLovedStories(s.stories.map((ss) => ss.userLoved));
                } else {
                    setLovedStories(Array(s.stories.length).fill(false));
                }
            });
    }, []);

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

    if (stories.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}
            >
                <ActivityIndicator
                    size={35}
                    style={{ marginBottom: 22 }}
                    animating
                    color={ipctColors.blueRibbon}
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <StatusBar hidden={true} />
            <View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    // backgroundColor: 'purple',
                    // alignSelf: 'flex-end',
                    width: '100%',
                }}
            >
                <View
                    style={{
                        // position: 'absolute',
                        // backgroundColor: 'red',
                        marginTop: 26,
                        marginHorizontal: 19,
                        // zIndex: 1,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // backgroundColor: 'yellow',
                        }}
                    >
                        <Image
                            source={{
                                uri: coverImage,
                            }}
                            style={{
                                height: 48,
                                width: 48,
                                borderRadius: 24,
                            }}
                        />
                        <View
                            style={{
                                // backgroundColor: 'red',
                                flexDirection: 'column',
                                // alignItems: 'center',
                                marginLeft: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Bold',
                                    fontSize: 19,
                                    lineHeight: 22,
                                    color: '#FAFAFA',
                                }}
                            >
                                {name.length > 23
                                    ? name.substr(0, 22) + '...'
                                    : name}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Bold',
                                    fontSize: 15,
                                    lineHeight: 18,
                                    color: '#FAFAFA',
                                }}
                            >
                                {countries[country].name},{' '}
                                {city.length > 15
                                    ? city.substr(0, 13) + '...'
                                    : city}
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        hitSlop={15}
                        onPress={(e) => navigation.goBack()}
                        style={{
                            right: 0,
                        }}
                    >
                        <CloseStorySvg />
                    </Pressable>
                </View>
            </View>
            <FlatList
                data={stories}
                style={{ flex: 1 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return <CarouselSlide data={item} />;
                }}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
            />
            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    alignSelf: 'flex-end',
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Gelion-Regular',
                        fontSize: 20,
                        lineHeight: 24,
                        color: 'white',
                        textAlign: 'center',
                        marginHorizontal: 22,
                        // backgroundColor: 'blue',
                    }}
                >
                    {stories[index].message}
                </Text>
                <View
                    style={{
                        marginVertical: 27,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Pressable
                        style={{ flexDirection: 'row' }}
                        hitSlop={15}
                        onPress={() => {
                            if (userAddress.length > 0) {
                                const l = lovedStories;
                                l[index] = !l[index];
                                setLovedStories([...l]);
                                Api.story.love(stories[index].id);
                                let previousStoriesValues = stories;
                                previousStoriesValues[index].loves += l[index]
                                    ? 1
                                    : -1;
                                setStories([...previousStoriesValues]);
                            } else {
                                Alert.alert(
                                    i18n.t('failure'),
                                    'You need to be authenticated!',
                                    [{ text: i18n.t('close') }],
                                    { cancelable: false }
                                );
                            }
                        }}
                    >
                        <StoryLoveSvg
                            style={{ marginLeft: 54 }}
                            loved={lovedStories[index]}
                        />
                        <Text
                            style={{
                                marginLeft: 8,
                                fontFamily: 'Gelion-Regular',
                                fontSize: 16,
                                lineHeight: 19,
                                color: 'white',
                            }}
                        >
                            {stories[index].loves} Loves
                        </Text>
                    </Pressable>
                    <Button
                        modeType="green"
                        bold
                        style={{ marginRight: 22, width: 158 }}
                        onPress={() =>
                            navigation.navigate(Screens.CommunityDetails, {
                                communityId: communityPublicId,
                                openDonate: true,
                            })
                        }
                    >
                        Donate
                    </Button>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {Array(stories.length)
                        .fill(0)
                        .map((_, _index) => (
                            <View
                                key={_index}
                                style={{
                                    flex: 1,
                                    marginHorizontal: 2,
                                    backgroundColor: '#E9ECEF',
                                    opacity: _index === index ? 1 : 0.37,
                                    height: 4,
                                }}
                            />
                        ))}
                </View>
            </View>
        </View>
    );
}

StoriesCarouselScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

export default StoriesCarouselScreen;
