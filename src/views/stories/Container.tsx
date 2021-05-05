import { useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import DeleteSvg from 'components/svg/DeleteSvg';
import ReportInapropriateSvg from 'components/svg/ReportInapropriateSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import { Screens } from 'helpers/constants';
import { ICommunityStories, ICommunityStory } from 'helpers/types/endpoints';
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
    community,
}: // media,
// message,
{
    community: ICommunityStories;
    story: ICommunityStory;
    // media: AppMediaContent | null;
    // message: string | null;
}) {
    const { cover, name, country, city } = community;
    const { media, message } = story;
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
                    {message}
                </Text>
            )}

            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    top: 5,
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
                            width: '80%',
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
                                    ? name.substr(0, 21) + '...'
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
                    <View style={{ flexDirection: 'row' }}>
                        <ThreeDotsSvg
                            setOpenThreeDotsMenu={setOpenThreeDotsMenu}
                            openThreeDotsMenu={openThreeDotsMenu}
                            style={{ marginHorizontal: 6 }}
                            title={i18n.t('story')}
                            titleStyle={titleStyle}
                            hasCloseBtn
                        >
                            <>
                                <Pressable
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        marginLeft: 24,
                                        marginVertical: 12,
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
                                                        console.log(
                                                            'Cancel Pressed'
                                                        ),
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: i18n.t('confirm'),
                                                    onPress: () =>
                                                        Api.story
                                                            .remove(story.id)
                                                            .then(() =>
                                                                Alert.alert(
                                                                    i18n.t(
                                                                        'success'
                                                                    ),
                                                                    i18n.t(
                                                                        'deleteSuccess'
                                                                    ),
                                                                    [
                                                                        {
                                                                            text: i18n.t(
                                                                                'close'
                                                                            ),
                                                                            onPress: () =>
                                                                                navigation.navigate(
                                                                                    Screens.Communities
                                                                                ),
                                                                        },
                                                                    ]
                                                                )
                                                            ),
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
                                <Pressable
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        marginLeft: 24,
                                        marginVertical: 12,
                                    }}
                                    hitSlop={15}
                                    onPress={() => {
                                        Alert.alert(
                                            i18n.t('reportAsInapropriated'),
                                            i18n.t('reportInapropriateWarning'),
                                            [
                                                {
                                                    text: i18n.t('cancel'),
                                                    onPress: () =>
                                                        console.log(
                                                            'Cancel Pressed'
                                                        ),
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: i18n.t('confirm'),
                                                    onPress: () =>
                                                        Api.story
                                                            .inapropriate(
                                                                story.id
                                                            )
                                                            .then(() =>
                                                                Alert.alert(
                                                                    i18n.t(
                                                                        'success'
                                                                    ),
                                                                    i18n.t(
                                                                        'reportInapropriateSuccess'
                                                                    ),
                                                                    [
                                                                        {
                                                                            text: i18n.t(
                                                                                'close'
                                                                            ),
                                                                            onPress: () =>
                                                                                navigation.navigate(
                                                                                    Screens.Communities
                                                                                ),
                                                                        },
                                                                    ]
                                                                )
                                                            ),
                                                },
                                            ]
                                        );
                                    }}
                                >
                                    <ReportInapropriateSvg />
                                    <Text
                                        style={{
                                            marginLeft: 13.4,
                                            fontFamily: 'Manrope-Bold',
                                            fontSize: 17,
                                            letterSpacing: 0.7,
                                        }}
                                    >
                                        {i18n.t('reportAsInapropriated')}
                                    </Text>
                                </Pressable>
                            </>
                        </ThreeDotsSvg>
                        <Pressable
                            hitSlop={15}
                            onPress={() => navigation.goBack()}
                            style={{
                                right: 0,
                            }}
                        >
                            <CloseStorySvg />
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}
