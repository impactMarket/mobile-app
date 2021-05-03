import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import DeleteSvg from 'components/svg/DeleteSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import { ICommunity, ICommunityStories } from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    Alert,
    StyleProp,
    TextStyle,
    useWindowDimensions,
} from 'react-native';
import Api from 'services/api';

import CarouselSlide from './CarouselSlide';

export default function Container({
    story,
    media,
}: {
    story: ICommunityStories;
    media: AppMediaContent | null;
}) {
    const { cover, name, country, city } = story;
    const [openThreeDotsMenu, setOpenThreeDotsMenu] = useState(false);
    const dimensions = useWindowDimensions();

    const navigation = useNavigation();

    const titleStyle: StyleProp<TextStyle> = {
        textAlign: 'left',
        marginLeft: 12,
    };

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

    return (
        <>
            {media ? (
                <CarouselSlide media={media} />
            ) : (
                <Text
                    style={{
                        fontFamily: 'Gelion-Regular',
                        fontSize: 20,
                        lineHeight: 24,
                        color: 'white',
                        textAlign: 'center',
                        marginHorizontal: 22,
                        top: dimensions.height * 0.25,
                    }}
                >
                    {story.stories.message}
                </Text>
            )}

            <View
                style={{
                    width: '100%',
                }}
            >
                <View
                    style={{
                        marginTop: 26,
                        marginHorizontal: 19,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={{
                                uri: cover.url,
                            }}
                            style={{
                                height: 48,
                                width: 48,
                                borderRadius: 24,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'column',
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
                                {name?.length > 23
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
                                {countries[country]?.name},{' '}
                                {city?.length > 15
                                    ? city.substr(0, 13) + '...'
                                    : city}
                            </Text>
                        </View>
                    </View>
                    <ThreeDotsSvg
                        setOpenThreeDotsMenu={setOpenThreeDotsMenu}
                        openThreeDotsMenu={openThreeDotsMenu}
                        style={{ marginLeft: 8.4, marginRight: -26 }}
                        title={i18n.t('story')}
                        titleStyle={titleStyle}
                        hasCloseBtn
                    >
                        <Pressable
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginLeft: 24,
                            }}
                            hitSlop={15}
                            onPress={() => {
                                Alert.alert(
                                    i18n.t('delete'),
                                    i18n.t('deleteWarning'),
                                    [
                                        {
                                            text: i18n.t('cancel'),
                                            onPress: () =>
                                                console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: i18n.t('confirm'),
                                            onPress: () =>
                                                Api.story.remove(story.id),
                                        },
                                    ]
                                );
                            }}
                        >
                            <DeleteSvg />
                            <Text
                                style={{
                                    marginLeft: 13.4,
                                    fontFamily: 'Manrope-Bold',
                                    fontSize: 17,
                                    letterSpacing: 0.7,
                                }}
                            >
                                {i18n.t('delete')}
                            </Text>
                        </Pressable>
                    </ThreeDotsSvg>
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
        </>
    );
}
