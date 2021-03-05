import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CloseStorySvg from 'components/svg/CloseStorySvg';
import CarouselSlide from './CarouselSlide';
import countriesJSON from 'assets/countries.json';

export default function Container({ story, media }) {
    const { coverImage, name, country, city } = story;

    const navigation = useNavigation();

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
