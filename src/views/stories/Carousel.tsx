import React, { useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    Pressable,
    Alert,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import StoryLoveSvg from 'components/svg/StoryLoveSvg';
import Button from 'components/core/Button';
import Api from 'services/api';
import { ICommunityStory } from 'helpers/types/endpoints';
import { Screens } from 'helpers/constants';
import { ActivityIndicator } from 'react-native-paper';
import { ipctColors } from 'styles/index';
import { useSelector } from 'react-redux';
import { IRootState } from 'helpers/types/state';
import i18n from 'assets/i18n';

import Container from './Container';

function Carousel(props: {
    communityId: number;
    goToOtherCommunity: (next: boolean) => void;
}) {
    const navigation = useNavigation();
    const dimensions = useWindowDimensions();

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
            .getByCommunity(props.communityId, userAddress.length > 0)
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

    const handlePressPrevious = () => {
        if (index === 0) {
            props.goToOtherCommunity(false);
        } else {
            setIndex(index - 1);
        }
    };

    const handlePressNext = () => {
        if (index === stories.length - 1) {
            props.goToOtherCommunity(true);
        } else {
            setIndex(index + 1);
        }
    };

    // if (true) {
    if (stories.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    height: dimensions.height,
                    width: dimensions.width,
                }}
            >
                <ActivityIndicator
                    size={35}
                    style={{
                        marginBottom: 22,
                        width: '100%',
                    }}
                    animating
                    color={ipctColors.blueRibbon}
                />
            </View>
        );
    }
    const story = { coverImage, name, country, city };
    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: 'column',
                width: dimensions.width,
                justifyContent: 'space-between',
            }}
        >
            <Container media={stories[index].media} story={story} />

            <View
                style={{
                    // backgroundColor: 'yellow',
                    width: '100%',
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
                <Pressable style={{ flex: 1 }} onPress={handlePressPrevious} />
                <Pressable style={{ flex: 1 }} onPress={handlePressNext} />
            </View>
            <View
                style={{
                    width: '100%',
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Gelion-Regular',
                        fontSize: 20,
                        lineHeight: 24,
                        color: 'white',
                        textAlign: 'left',
                        marginHorizontal: 22,
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
                        {i18n.t('donate')}
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
            <LinearGradient
                style={{
                    height: 98,
                    // backgroundColor: 'green',
                    width: dimensions.width,
                    // flexDirection: 'row',
                    zIndex: -1,
                    position: 'absolute',
                }}
                colors={[
                    'rgba(11, 11, 11, 0.4) 49.44%',
                    'rgba(196, 196, 196, 0) 98.96%',
                ]}
            />
            <LinearGradient
                style={{
                    height: 354,
                    // backgroundColor: 'green',
                    width: dimensions.width,
                    // flexDirection: 'row',
                    zIndex: -1,
                    position: 'absolute',
                    bottom: 0,
                }}
                colors={['rgba(196, 196, 196, 0)', '#0B0B0B']}
            />
        </SafeAreaView>
    );
}

export default Carousel;
