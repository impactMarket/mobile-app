import React, { useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Api from 'services/api';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import DeleteSvg from 'components/svg/DeleteSvg';
import CarouselSlide from './CarouselSlide';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';

export default function Container({ story, media }) {
    const { id, coverImage, name, country, city } = story;
    const [openThreeDotsMenu, setOpenThreeDotsMenu] = useState(false);

    const navigation = useNavigation();

    const titleStyle = { textAlign: 'left', marginLeft: 12 };

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
            <CarouselSlide media={media} />
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
                        hasCloseBtn={true}
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
