import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BottomPopup from 'components/core/BottomPopup';
import Button from 'components/core/Button';
import StoryLoveSvg from 'components/svg/StoryLoveSvg';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import { Screens } from 'helpers/constants';
import { ICommunityStories, ICommunityStory } from 'helpers/types/endpoints';
import { IRootState, ICallerRouteParams } from 'helpers/types/state';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    Alert,
    useWindowDimensions,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Api from 'services/api';
import { ipctColors } from 'styles/index';

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

    const myStories = useSelector(
        (state: IRootState) => state.stories.myStories
    );

    const route =
        useRoute<RouteProp<Record<string, ICallerRouteParams>, string>>();

    const [index, setIndex] = useState(0);
    const [stories, setStories] = useState<ICommunityStory[]>([]);
    const [lovedStories, setLovedStories] = useState<boolean[]>([]);
    const [communityStories, setCommunityStories] =
        useState<ICommunityStories>();
    const [openPopup, setOpenPopup] = useState(false);

    const togglePopup = () => setOpenPopup(!openPopup);
    const { caller } = route.params ?? {};

    useEffect(() => {
        if (caller === 'MY_STORIES') {
            if (myStories?.length > 0) {
                setStories(myStories);
            }
        } else {
            Api.story.getByCommunity(props.communityId).then((s) => {
                setCommunityStories(s);
                setStories(s.stories);
                if (userAddress.length > 0) {
                    setLovedStories(s.stories.map((ss) => ss.userLoved));
                } else {
                    setLovedStories(Array(s.stories.length).fill(false));
                }
            });
        }
    }, [caller, myStories, props.communityId, userAddress]);

    const handlePressPrevious = () => {
        if (index === 0 && caller !== 'MY_STORIES') {
            props.goToOtherCommunity(false);
        } else if (index > 0) {
            setIndex(index - 1);
        }
    };

    const handlePressNext = () => {
        if (index === stories.length - 1 && caller !== 'MY_STORIES') {
            props.goToOtherCommunity(true);
        } else if (index < stories.length - 1) {
            setIndex(index + 1);
        }
    };

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

    if (caller === 'MY_STORIES' && stories.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    alignSelf: 'center',
                }}
            >
                <Text style={styles.title}>
                    {i18n.t('stories.emptyStoriesTitle')}
                </Text>
                <Text style={styles.text}>
                    {i18n.t('stories.emptyStoriesDescription')}
                </Text>
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
                            {i18n.t('stories.createStory')}
                        </Text>
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                width: dimensions.width,
                justifyContent: 'space-between',
                backgroundColor: '#73839D',
            }}
        >
            <StatusBar hidden />
            <Container
                communityId={props.communityId}
                community={
                    communityStories
                        ? communityStories
                        : {
                              id: 0,
                              cover: { url: '', id: 0, height: 0, width: 0 },
                              name: '',
                              country: '',
                              city: '',
                              stories: [],
                          }
                }
                story={stories[index]}
            />

            <View
                style={{
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
                {stories[index].media && stories[index].message && (
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
                )}
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
                                const previousStoriesValues = stories;
                                previousStoriesValues[index].loves += l[index]
                                    ? 1
                                    : -1;
                                setStories([...previousStoriesValues]);
                            } else {
                                Alert.alert(
                                    i18n.t('generic.failure'),
                                    'You need to be authenticated!',
                                    [{ text: i18n.t('generic.close') }],
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
                    {communityStories?.id !== -1 &&
                        Device.brand.toLowerCase() !== 'apple' && (
                            <Button
                                modeType="green"
                                bold
                                style={{
                                    marginRight: 22,
                                    width: 128,
                                }}
                                onPress={() =>
                                    navigation.navigate(
                                        Screens.CommunityDetails,
                                        {
                                            communityId: communityStories?.id,
                                            openDonate: true,
                                        }
                                    )
                                }
                            >
                                {i18n.t('donate.donate')}
                            </Button>
                        )}
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
                                    marginBottom: 8,
                                }}
                            />
                        ))}
                </View>
            </View>
            <LinearGradient
                style={{
                    flex: 1,
                    height: '80%',
                    width: dimensions.width,
                    zIndex: -1,
                    bottom: 0,
                    position: 'absolute',
                }}
                colors={['#00000001', '#73839D30', '#0B0B0B']}
                locations={[0.3, 0.6, 1]}
            />
            {/* TODO: Fix a shadow line that is still there. */}
            <LinearGradient
                style={{
                    flex: 1,
                    height: '20%',
                    width: dimensions.width,
                    zIndex: -1,
                    top: 0,
                    position: 'absolute',
                }}
                colors={['#0B0B0B', '#73839D30', '#00000001']}
                locations={
                    stories[index].media ? [0.05, 0.7, 1] : [0.001, 0.6, 1]
                }
            />
            <LinearGradient
                style={{
                    flex: 1,
                    width: dimensions.width,
                    zIndex: -1,
                    position: 'absolute',
                }}
                colors={['#73839D', '#1E3252']}
            />
            <BottomPopup
                isVisible={openPopup}
                toggleVisibility={togglePopup}
                title={i18n.t('generic.story')}
            >
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                    }}
                />
            </BottomPopup>
        </View>
    );
}

Carousel.navigationOptions = () => {
    return {
        headerShown: true,
    };
};

export default Carousel;

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
