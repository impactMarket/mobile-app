import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    FlatList,
    useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import { useNavigation } from '@react-navigation/native';
import StoryLoveSvg from 'components/svg/StoryLoveSvg';
import Button from 'components/core/Button';

function StoriesCarouselScreen() {
    const navigation = useNavigation();
    const dimensions = useWindowDimensions();

    const [index, setIndex] = useState(0);
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

    function Slide({ data }: { data: any }) {
        return (
            <View
                style={{
                    height: dimensions.height,
                    width: dimensions.width,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                <Image
                    source={{ uri: data.image }}
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                    }}
                ></Image>
                {/* {/* <Text style={{ fontSize: 24 }}>{data.title}</Text> */}
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
                        {data.subtitle}
                    </Text>
                    <View
                        style={{
                            marginVertical: 27,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <StoryLoveSvg style={{ marginLeft: 54 }} />
                            <Text
                                style={{
                                    marginLeft: 8,
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 16,
                                    lineHeight: 19,
                                    color: 'white',
                                }}
                            >
                                34 Loves
                            </Text>
                        </View>
                        <Button
                            modeType="green"
                            bold
                            style={{ marginRight: 22, width: 158 }}
                        >
                            Donate
                        </Button>
                    </View>
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
                        {index + 1}/5
                    </Text>
                </View>
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
                                uri:
                                    'https://yt3.ggpht.com/ytc/AAUvwnigEMrvOIpqlF23fLXCsdjUnb6yfQShZayTwM3bVQ=s900-c-k-c0x00ffffff-no-rj',
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
                                Fehsolna
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Bold',
                                    fontSize: 15,
                                    lineHeight: 18,
                                    color: '#FAFAFA',
                                }}
                            >
                                Brazil
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            right: 0,
                            // backgroundColor: 'green'
                        }}
                    >
                        <CloseStorySvg onPress={(e) => navigation.goBack()} />
                    </View>
                </View>
                {/* <View
                    style={{
                        backgroundColor: 'blue',
                        // position: 'absolute',
                        width: '100%',
                        height: 100,
                        flex: 2,
                        flexDirection: 'row',
                    }}
                >
                    <Pressable style={{ flex: 1, backgroundColor: 'yellow' }} />
                    <Pressable style={{ flex: 1, backgroundColor: 'green' }} />
                </View> */}
            </View>
            {/* <Text>StoriesCarouselScreen</Text> */}
            {/* <Image
                source={{
                    uri:
                        'https://s3.amazonaws.com/mobilecause-avatar-production/shared_img/shared_imgs/220827/original/NGO_Volunteers_and_Kids_6.jpg?1548269069',
                }}
                style={{
                    flex: 1,
                    // resizeMode: 'cover',
                    justifyContent: 'center',
                    // alignItems: 'flex-end',
                    // borderRadius: 8,
                }}
            /> */}
            <FlatList
                data={Array.from({ length: 5 }).map((_, i) => {
                    return {
                        id: i,
                        image: `https://picsum.photos/1440/2842?random=${i}`,
                        title: `This is the title! ${i + 1}`,
                        subtitle: `This is the subtitle ${i + 1}!`,
                    };
                })}
                style={{ flex: 1, backgroundColor: 'green' }}
                renderItem={({ item }) => {
                    return <Slide data={item} />;
                }}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
            />
        </View>
    );
}

StoriesCarouselScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
};

export default StoriesCarouselScreen;
