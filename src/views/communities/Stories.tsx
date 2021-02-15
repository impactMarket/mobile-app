import { Screens } from 'helpers/constants';
import { navigationRef } from 'helpers/rootNavigation';
import React, { Component } from 'react';
import { ScrollView, Text, View, Image, Pressable } from 'react-native';
import { Headline } from 'react-native-paper';

export default class Stories extends Component<{}, {}> {
    render() {
        return (
            <View
                style={{
                    // backgroundColor: 'red',
                    marginHorizontal: 18,
                    marginBottom: 18,
                }}
            >
                <View
                    style={{
                        // backgroundColor: 'red',
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
                >
                    <Pressable
                        style={{
                            backgroundColor: 'blue',
                            width: 98.16,
                            height: 167,
                            borderRadius: 8,
                            marginRight: 11.84,
                            // flexDirection: 'row',
                            // alignItems: 'flex-end',
                        }}
                        onPress={(e) =>
                            navigationRef.current?.navigate(
                                Screens.StoriesCarousel
                            )
                        }
                    >
                        <Image
                            source={{ uri: 'https://reactjs.org/logo-og.png' }}
                            style={{
                                flex: 1,
                                // resizeMode: 'cover',
                                justifyContent: 'center',
                                // alignItems: 'flex-end',
                                borderRadius: 8,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Text
                                style={{
                                    backgroundColor: 'red',
                                    position: 'absolute',
                                    fontFamily: 'Gelion-Bold',
                                    fontSize: 14,
                                    lineHeight: 16,
                                    color: '#FFFFFF',
                                    paddingBottom: 9,
                                    marginHorizontal: 12,
                                }}
                            >
                                Toze
                            </Text>
                        </View>
                        {/* </ImageBackground> */}
                    </Pressable>
                    <View
                        style={{
                            backgroundColor: 'blue',
                            width: 98.16,
                            height: 167,
                            borderRadius: 8,
                            marginRight: 11.84,
                        }}
                    ></View>
                    <View
                        style={{
                            backgroundColor: 'blue',
                            width: 98.16,
                            height: 167,
                            borderRadius: 8,
                            marginRight: 11.84,
                        }}
                    ></View>
                    <View
                        style={{
                            backgroundColor: 'blue',
                            width: 98.16,
                            height: 167,
                            borderRadius: 8,
                            marginRight: 11.84,
                        }}
                    ></View>
                </ScrollView>
            </View>
        );
    }
}
